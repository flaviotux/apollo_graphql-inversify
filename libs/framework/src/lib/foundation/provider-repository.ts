import { inject, injectable } from 'inversify';

import { Application } from './application';

@injectable()
export class ProviderRepository {
  protected readonly _app: Application;

  constructor(@inject(Application) app: Application) {
    this._app = app;
  }
}
