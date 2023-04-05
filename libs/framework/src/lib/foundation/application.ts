import { Container, interfaces } from 'inversify';

import { Application as IApplication } from '../contracts/foundation/application';
import { Bootstrapper as IBootstrapper } from '../contracts/support/bootstrapper';
import { Provider as IProvider } from '../contracts/support/provider';
import { EventProvider } from '../events/event-provider';
import { RoutingProvider } from '../routing/routing-provider';

export class Application extends Container implements IApplication {
  public static _instance: Application;

  protected _providers: IProvider[] = [];

  protected _booted = false;

  protected _bootstrapped = false;

  constructor(containerOptions?: interfaces.ContainerOptions) {
    if (Application._instance) {
      return Application._instance;
    }

    super(containerOptions);

    this.registerBaseBindings();
    this.registerBaseProviders();
  }

  public static instance(app: Application) {
    this._instance = app;
  }

  public static getInstance() {
    if (this._instance) {
      return this._instance;
    }

    return new Application();
  }

  protected registerBaseBindings() {
    Application.instance(this);

    this.bind(Application).toConstantValue(this);
    this.bind('app').toConstantValue(this);
  }

  protected registerBaseProviders() {
    this.register(RoutingProvider);
    this.register(EventProvider);
  }

  public register(
    provider:
      | interfaces.ServiceIdentifier<IProvider>
      | interfaces.Newable<IProvider>,
    force = false
  ) {
    const registered = this.getProvider(provider);

    if (registered && !force) {
      return registered;
    }

    const currentProvider = this.resolveProvider(
      provider as interfaces.Newable<IProvider>
    );

    currentProvider.register();

    if ('bindings' in currentProvider) {
      if (typeof currentProvider.bindings === 'object') {
        Object.entries(
          currentProvider.bindings as Record<string, ObjectConstructor>
        ).forEach(([key, value]) => {
          this.bind(key).to(value);
        });
      }

      if (Array.isArray(currentProvider.bindings)) {
        currentProvider.bindings?.forEach((value: ObjectConstructor) => {
          this.bind(value).toSelf();
        });
      }
    }

    if ('singletons' in currentProvider) {
      if (typeof currentProvider.singletons === 'object') {
        Object.entries(
          currentProvider.singletons as Record<string, ObjectConstructor>
        ).forEach(([key, value]) => {
          this.singletonIf(key, value);
        });
      }

      if (Array.isArray(currentProvider.singletons)) {
        currentProvider.singletons?.forEach((value: ObjectConstructor) => {
          this.singletonIf(value);
        });
      }
    }

    this.markAsRegistered(currentProvider);

    if (this.isBooted()) {
      this.bootProvider(currentProvider);
    }

    return currentProvider;
  }

  public getProvider(provider: interfaces.ServiceIdentifier<IProvider>) {
    return this._providers.find((pvd) => typeof pvd === provider);
  }

  public resolveProvider(
    provider: new (app: IApplication) => IProvider
  ): IProvider {
    return new provider(this);
  }

  protected markAsRegistered(provider: IProvider) {
    this._providers.push(provider);
  }

  public boot(): void {
    if (this.isBooted()) {
      return;
    }

    this._providers.forEach((provider) => this.bootProvider(provider));
    this._booted = true;
  }

  public singleton<T>(
    service: interfaces.ServiceIdentifier<T>,
    concrete?: interfaces.Newable<T> | interfaces.ProviderCreator<T>
  ): interfaces.BindingWhenOnSyntax<T> {
    if (typeof concrete === 'function') {
      return this.bind(service).toProvider(
        concrete as interfaces.ProviderCreator<T>
      );
    }

    if (typeof service === 'string' && concrete) {
      return this.bind<T>(service).to(concrete).inSingletonScope();
    }

    return this.bind<T>(service).toSelf().inSingletonScope();
  }

  public singletonIf<T>(
    service: interfaces.ServiceIdentifier<T>,
    concrete?: interfaces.Newable<T> | interfaces.ProviderCreator<T>
  ): interfaces.BindingWhenOnSyntax<T> | void {
    if (!this.isBound(service)) {
      if (typeof concrete === 'function') {
        return this.bind(service).toProvider(
          concrete as interfaces.ProviderCreator<T>
        );
      }

      if (typeof service === 'string' && concrete) {
        return this.bind<T>(service).to(concrete).inSingletonScope();
      }

      return this.bind<T>(service).toSelf().inSingletonScope();
    }
  }

  public isBooted() {
    return this._booted;
  }

  protected bootProvider(provider: IProvider) {
    provider.boot();
  }

  public registerConfiguredProviders(): void {
    const providers: interfaces.Newable<IProvider>[] =
      this.get('config.providers');

    providers.forEach((provider) => this.register(provider));
  }

  public bootstrapWith(bootstrappers: unknown[]) {
    this._bootstrapped = true;

    bootstrappers.forEach((bootstrapper: interfaces.Newable<IBootstrapper>) => {
      this.resolve<IBootstrapper>(bootstrapper).bootstrap(this);
    });
  }

  public hasBeenBootstraped() {
    return this._bootstrapped;
  }
}
