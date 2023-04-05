import { interfaces } from 'inversify';

import { Provider as IProvider } from '../support/provider';

export interface Application extends interfaces.Container {
  boot(): void;
  isBooted(): boolean;
  singleton<T>(
    service: interfaces.ServiceIdentifier<T>,
    concrete?: interfaces.Newable<T>
  ): interfaces.BindingWhenOnSyntax<T>;
  singletonIf<T>(
    service: interfaces.ServiceIdentifier<T>,
    concrete?: interfaces.Newable<T>
  ): interfaces.BindingWhenOnSyntax<T> | void;
  registerConfiguredProviders(): void;
  getProvider(
    provider: interfaces.ServiceIdentifier<IProvider>
  ): IProvider | undefined;
  register(
    provider:
      | interfaces.ServiceIdentifier<IProvider>
      | interfaces.Newable<IProvider>,
    force?: boolean
  ): IProvider;
  resolveProvider(provider: new (app: Application) => IProvider): IProvider;
}
