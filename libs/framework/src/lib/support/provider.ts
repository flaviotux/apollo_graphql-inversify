import { Provider as IProvider } from '../contracts/support/provider';
import { Application } from '../foundation/application';

export abstract class Provider implements IProvider {
  protected readonly _app: Application;

  constructor(app: Application) {
    this._app = app;
  }

  public register() {
    //
  }

  public boot() {
    //
  }
}
