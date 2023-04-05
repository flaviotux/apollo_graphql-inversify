import { interfaces } from 'inversify';

import { RouteAction } from './route-action';
import { Router } from './router';

export class Route {
  protected _uri: string;

  protected _methods: string[];

  protected _action: Record<'uses', unknown> | { uses: () => never };

  protected _router: Router;

  protected _container: interfaces.Container;

  constructor(
    methods: string[],
    uri: string,
    action: Record<string | 'uses' | 'prefix', unknown> | []
  ) {
    this._uri = uri;
    this._methods = methods;
    this._action = this.parseAction(action);

    if (this._methods.includes('GET') && !this._methods.includes('HEAD')) {
      this._methods.push('HEAD');
    }
  }

  protected parseAction(action: Record<string | 'uses', unknown> | []) {
    return RouteAction.parse(this._uri, action);
  }

  public setRouter(router: Router) {
    this._router = router;

    return this;
  }

  public setContainer(container: interfaces.Container) {
    this._container = container;

    return this;
  }
}
