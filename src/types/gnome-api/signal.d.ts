type ITargetSignal = string;
type ITargetListener = () => void;

interface ITarget {
  connect(signal: ITargetSignal, listener: ITargetListener): ITargetListener;
  disconnect(listener: ITargetListener): ITargetListener;
}

interface ITargetGroup {
  target: ITarget;
  signals: ITargetSignal[];
  listeners: ITargetListener[];
}
