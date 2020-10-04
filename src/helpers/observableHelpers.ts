type Observer<T> = (value: T) => void;

export class Observable<T> {
  nextObserverId = 0;
  observers = new Map<number, Observer<T>>();

  subscribe = (callback: Observer<T>) => {
    const observerId = this.nextObserverId;
    this.observers.set(observerId, callback);
    this.nextObserverId += 1;
    return () => this.unsubscribe(observerId);
  };

  unsubscribe = (observerId: number) => {
    this.observers.delete(observerId);
  };

  publish = (value: T) => {
    for (const observer of this.observers.values()) {
      observer(value);
    }
  };
}
