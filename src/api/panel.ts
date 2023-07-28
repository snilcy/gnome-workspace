import { Widget } from './widget'

const gPanel = imports.ui.main.panel

export enum PANEL_BOX_POSITION {
  LEFT,
  CENTER,
  RIGTH,
}

export const Panel = {
  leftBox: new Widget({ container: () => gPanel._leftBox }),
  centerBox: new Widget({ container: () => gPanel._centerBox }),
  rightBox: new Widget({ container: () => gPanel._rightBox }),
}
