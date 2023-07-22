import type Meta from '@girs/meta-12'

export class Window {
  constructor(private gWindow: Meta.Window) {}

  get isOnSecondMonitor() {
    return this.gWindow.is_on_all_workspaces()
  }
}
