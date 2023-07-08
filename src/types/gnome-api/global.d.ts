/// <reference path="gi.d.ts" />
/// <reference path="ui.d.ts" />
/// <reference path="misc.d.ts" />
/// <reference path="shell.d.ts" />
/// <reference path="workspace-manager.d.ts" />

declare namespace imports {
  export const gi: IGI;
  export const ui: IUI;
  export const misc: IMisc;
  export const gettext: string;
  export const cairo: string;
}

declare namespace global {
  export function get_current_time(): void;
  export const workspace_manager: IWorkspaceManager;
  export const display: string;
}

declare namespace Shell {
  export const WindowTracker: IShellWindowTracker;
}

declare function log(...message: any[]): void;
