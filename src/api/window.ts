import type Meta from '@girs/meta-12'
import type Shell from '@girs/shell-12'
import { Widget } from './widget'
import { St } from './st'
import { Config, Workspace } from '.'

export class Window {
  gWindowTracker = imports.gi.Shell.WindowTracker.get_default()
  app: Shell.App

  constructor(
    private gWindow: Meta.Window,
    public workspace: Workspace,
  ) {
    this.app = this.gWindowTracker.get_window_app(this.gWindow)
  }

  get isOnSecondMonitor() {
    return this.gWindow.is_on_all_workspaces()
  }

  get id() {
    return this.gWindow.get_id()
  }

  get pid() {
    return this.gWindow.get_pid()
  }

  get role() {
    return this.gWindow.get_role()
  }

  get class() {
    return this.gWindow.get_wm_class()
  }

  get instance() {
    return this.gWindow.get_wm_class_instance()
  }

  get title() {
    return this.gWindow.get_title()
  }

  get description() {
    return this.gWindow.get_description()
  }

  getIcon(size: number = 20) {
    const icon = new Widget({
      gChildren: imports.gi.Shell.WindowTracker.get_default()
        .get_window_app(this.gWindow)
        .create_icon_texture(size),
    })

    return icon
  }

  get active() {
    return this.gWindow.has_focus()
  }

  activate() {
    this.gWindow.activate(global.get_current_time())
  }

  focus() {
    this.gWindow.focus(global.get_current_time())
  }

  raise() {
    this.gWindow.raise()
  }
}
