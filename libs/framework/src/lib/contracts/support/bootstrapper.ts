import { Application as ApplicationContract } from '../foundation/application';

export interface Bootstrapper {
  bootstrap(app: ApplicationContract): void;
}
