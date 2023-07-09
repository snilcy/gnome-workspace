type ITargetSignal = string;
type ISignalCallbackParams<T> = (...args: Parameters<T[keyof T]>) => void;

interface ITarget<S> {
  connect(signal: keyof S, listener: ISignalCallbackParams<S>): ITargetListener;
  disconnect(listener: ITargetListener): ITargetListener;
}

interface ITargetGroup {
  target: ITarget;
  signals: ITargetSignal[];
  listeners: ITargetListener[];
}
