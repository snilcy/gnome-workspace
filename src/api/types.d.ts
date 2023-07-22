import type { Meta } from '@girs/meta-12'
import type { Shell } from '@girs/shell-12'
import type { ui as gui, misc } from '@girs/gnome-shell'

export class Panel {
  _leftBox: St.BoxLayout
  _centerBox: St.BoxLayout
  _rightBox: St.BoxLayout
}

declare const ui: {
  main: {
    panel: Panel
  }
}

export declare global {
  export const global: Shell.Global

  export interface GjsImports {
    ui: typeof gui & typeof ui
    misc: typeof misc
  }
}
