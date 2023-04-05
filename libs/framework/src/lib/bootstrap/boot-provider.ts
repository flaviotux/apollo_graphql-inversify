import { injectable } from 'inversify';

import { Application as IApplication } from '../contracts/foundation/application';
import { Bootstrapper as IBootstrapper } from '../contracts/support/bootstrapper';

@injectable()
export class BootProvider implements IBootstrapper {
  public bootstrap(app: IApplication): void {
    app.boot();
  }
}
