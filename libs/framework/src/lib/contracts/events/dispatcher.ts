export interface Dispatcher {
  listen: NodeJS.EventEmitter['addListener'];
  dispatch: NodeJS.EventEmitter['emit'];
  hasListeners(eventName: string | symbol): boolean;
  subscribe(subscriber: string | symbol): void;
}
