/// <reference path="signal.d.ts" />

declare namespace Meta {
  export enum IMotionDirection {
    UP = -1,
    DOWN = -2,
    LEFT = -3,
    RIGHT = -4,
    UP_LEFT = -5,
    UP_RIGHT = -6,
    DOWN_LEFT = -7,
    DOWN_RIGHT = -8,
  }

  export interface IWindow {
    todo: any;
  }

  interface IDisplaySignal {
    restacked: (display: IDisplay) => void;

    'window-left-monitor': (
      display: IDisplay,
      object: number,
      p0: IWindow,
    ) => void;

    'window-entered-monitor': (
      display: IDisplay,
      object: number,
      p0: IWindow,
    ) => void;
  }

  interface IWorkspaceManagerSignal {
    'workspace-switched': (
      workspaceManager: IWorkspaceManager,
      object: number,
      p0: number,
      p1: IMotionDirection,
    ) => void;

    'workspaces-reordered': (workspaceManager: IWorkspaceManager) => void;
  }

  export interface IDisplay extends ITarget<IDisplaySignal> {
    todo: any;
  }

  export interface IWorkspaceManager extends ITarget {
    todo: any;
  }
}
