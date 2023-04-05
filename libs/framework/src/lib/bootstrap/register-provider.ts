import { injectable } from 'inversify';

import { Application as IApplication } from '../contracts/foundation/application';
import { Bootstrapper as BootstrapperContract } from '../contracts/support/bootstrapper';

@injectable()
export class RegisterProvider implements BootstrapperContract {
  public bootstrap(app: IApplication): void {
    app.registerConfiguredProviders();
  }
}
