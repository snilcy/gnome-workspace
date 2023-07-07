/// <reference path="gi.d.ts" />
/// <reference path="ui.d.ts" />
/// <reference path="misc.d.ts" />

declare namespace imports {
  export const gi: Igi;
  export const ui: Iui;
  export const misc: Imisc;
  export const gettext: string;
  export const cairo: string;
}

declare namespace global {
  export function get_current_time(): void;
  export const workspace_manager: string;
  export const display: string;
}

declare function log(...message: any[]): void;
