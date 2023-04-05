import EventEmitter from 'events';
import { interfaces } from 'inversify';

import { Dispatcher as IDispatcher } from '../contracts/events/dispatcher';

export class Dispatcher extends EventEmitter implements IDispatcher {
  protected _container: interfaces.Container;

  constructor(container: interfaces.Container) {
    super();
    this._container = container;
  }

  listen(
    eventName: string | symbol,
    listener: (...args: never[]) => void
  ): this {
    throw new Error('Method not implemented.');
  }

  dispatch(eventName: string | symbol, ...args: never[]): boolean {
    throw new Error('Method not implemented.');
  }

  hasListeners(eventName: string | symbol): boolean {
    throw new Error('Method not implemented.');
  }

  subscribe(subscriber: string | symbol): void {
    throw new Error('Method not implemented.');
  }
}
