import { St } from '.'
import type { Clutter } from '@girs/clutter-12'
import type ISt from 'st-12'

export class List {
  container = new St.BoxLayout()

  constructor() {}

  appendChild(child: Clutter.Actor) {
    this.container.insert_child_above(child, null)
  }

  appendChilds(childs: Clutter.Actor[]) {
    childs.forEach((child) => {
      this.container.insert_child_above(child, null)
    })
  }

  clear() {
    this.container.destroy_all_children()
  }

  destroy() {
    this.container.destroy()
  }
}
