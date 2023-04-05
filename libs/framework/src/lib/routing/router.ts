import { inject, injectable, interfaces } from 'inversify';

import { Route } from './route';
import { RouteCollection } from './route-collection';
import { Application as IApplication } from '../contracts/foundation/application';
import { Dispatcher } from '../events/dispatcher';

@injectable()
export class Router {
  protected _events: Dispatcher;

  protected _routes: RouteCollection;

  protected _container: interfaces.Container;

  protected _middlewareGroup: Record<string, []> = {};

  protected _middleware: Record<string, []> = {};

  protected _groupStack: Record<'prefix', string>[] = [];

  constructor(
    @inject('events') events: Dispatcher,
    @inject('app') container: IApplication
  ) {
    this._events = events;
    this._routes = new RouteCollection();
    this._container = container;
  }

  public get(uri: string, action: Record<string | 'uses', unknown> | []) {
    return this.addRoute(['GET', 'HEAD'], uri, action);
  }

  public getLastGroupPrefix() {
    if (this.hasGroupStack()) {
      const [last] = this._groupStack.slice(-1);

      return last.prefix ?? '';
    }
    return '';
  }

  public addRoute(
    methods: string[],
    uri: string,
    action: Record<string | 'uses', unknown> | []
  ) {
    return this._routes.add(this.createRoute(methods, uri, action));
  }

  protected createRoute(
    methods: string[],
    uri: string,
    action: Record<string | 'uses', unknown> | []
  ) {
    return this.newRoute(methods, this.prefix(uri), action);
  }

  public newRoute(
    methods: string[],
    uri: string,
    action: Record<string | 'uses', unknown> | []
  ): Route {
    return new Route(methods, uri, action)
      .setRouter(this)
      .setContainer(this._container);
  }

  protected prefix(uri: string) {
    return `${this.getLastGroupPrefix() ?? '/'}${uri ?? '/'}`.trim() ?? '/';
  }

  public aliasMiddleware(name: string, middleware: []) {
    this._middleware[name] = middleware;

    return this;
  }

  public middlewareGroup(name: string, middleware: []) {
    this._middlewareGroup[name] = middleware;

    return this;
  }

  public hasGroupStack() {
    return !!this._groupStack.length;
  }
}
