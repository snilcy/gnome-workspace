import type Meta from '@girs/meta-12'
import { Window } from './window'

export class Workspace {
  constructor(private gWorkspace: Meta.Workspace) {}

  get windows() {
    return this.gWorkspace
      .list_windows()
      .map((gWindow) => new Window(gWindow, this))
  }

  get active() {
    return this.gWorkspace.active
  }

  get index() {
    return this.gWorkspace.index()
  }

  activate() {
    this.gWorkspace.activate(global.get_current_time())
  }
}
