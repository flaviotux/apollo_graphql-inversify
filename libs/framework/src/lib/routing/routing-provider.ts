import { injectable } from 'inversify';

import { Router } from './router';
import { Provider } from '../support/provider';

@injectable()
export class RoutingProvider extends Provider {
  public register(): void {
    this.registerRouter();
  }

  protected registerRouter() {
    this._app.singleton(Router);
  }
}
