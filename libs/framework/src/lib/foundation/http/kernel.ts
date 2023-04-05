import { inject, injectable } from 'inversify';

import { BootProvider } from '../../bootstrap/boot-provider';
import { RegisterProvider } from '../../bootstrap/register-provider';
import { Kernel as IKernel } from '../../contracts/foundation/http/kernel';
import { Router } from '../../routing/router';
import { Application } from '../application';

@injectable()
export abstract class Kernel implements IKernel {
  protected readonly _app: Application;

  protected _router: Router;

  protected _bootstrappers = [RegisterProvider, BootProvider];

  protected _middleware: [] = [];

  protected _middlewareGroups: Record<string, []> = {};

  protected _routeMiddleware: Record<string, []> = {};

  protected _middlewareAliases: Record<string, string> = {};

  protected _requestStartedAt: number;

  protected _requestEndedAt: number;

  constructor(
    @inject(Application) app: Application,
    @inject(Router) router: Router
  ) {
    this._app = app;
    this._router = router;

    this.syncMiddlewareToRouter();
  }

  public bootstrap() {
    if (!this._app.hasBeenBootstraped()) {
      this._app.bootstrapWith(this._bootstrappers);
    }
  }

  public handle() {
    this._requestStartedAt = Date.now();

    this.bootstrap();
  }

  public terminate() {
    //
  }

  protected syncMiddlewareToRouter() {
    Object.entries(this._middlewareGroups).forEach(([name, middleware]) => {
      this._router.middlewareGroup(name, middleware);
    });

    Object.entries({
      ...this._routeMiddleware,
      ...this._middlewareAliases,
    }).forEach(([name, middleware]: [string, []]) => {
      this._router.aliasMiddleware(name, middleware);
    });
  }
}
