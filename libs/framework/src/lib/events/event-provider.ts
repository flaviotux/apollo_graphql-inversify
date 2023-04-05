import { injectable, interfaces } from 'inversify';

import { Dispatcher } from './dispatcher';
import { Provider } from '../support/provider';

@injectable()
export class EventProvider extends Provider {
  public register(): void {
    this._app.singleton('events', (context: interfaces.Context) => {
      return () =>
        Promise.resolve(() => {
          return new Dispatcher(context.container);
        });
    });
  }
}
