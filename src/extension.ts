import cl from 'classnames'

import { Log } from './utils'
import {
  Display,
  WorkspaceManager,
  WindowTracker,
  Workspace,
  Panel,
  Widget,
  St,
  Config,
  Window,
} from './api'
import type ISt from '@girs/st-12'
import { WidgetButton } from './api/widget-button'
import { uuid } from './metadata.json'

Config.init({
  cssPrefix: uuid,
})

function init(meta: any) {
  Log('WorkspaceIndicator.init', meta)
  return new WorkspaceIndicator()
}

class WorkspaceIndicator {
  container = new Widget()

  listeners: {
    target: { disconnect(handlerID: number): void }
    handlerIDs: number[]
  }[] = []

  enable() {
    Log('WorkspaceIndicator.enable')
    this.connectSignals()
    this.container.destroy()
    this.container = new Widget({
      className: 'root',
    })
    this.refresh()
    Panel.leftBox.appendChildren(this.container, 0)
  }

  disable() {
    Log('WorkspaceIndicator.disable')
    try {
      if (this.container && this.container.destroy) {
        this.container.destroy()
      }
    } catch (err) {
      Log(err)
    }
    this.disconnectSignals()
    // this.container.destroy()
  }

  connectSignals() {
    this.listeners = [
      {
        target: WorkspaceManager,
        handlerIDs: [
          WorkspaceManager.connect('notify::n-workspaces', () =>
            this.refresh('WorkspaceManager.notify::n-workspaces'),
          ),
          WorkspaceManager.connect('workspace-switched', () =>
            this.refresh('WorkspaceManager.workspace-switched'),
          ),
          WorkspaceManager.connect('workspaces-reordered', () =>
            this.refresh('WorkspaceManager.workspaces-reordered'),
          ),
        ],
      },
      {
        target: Display,
        handlerIDs: [
          Display.connect('restacked', () => this.refresh('Display.restacked')),
          Display.connect('window-left-monitor', () =>
            this.refresh('Display.window-left-monitor'),
          ),
          Display.connect('window-entered-monitor', () =>
            this.refresh('Display.window-entered-monitor'),
          ),
        ],
      },
      {
        target: WindowTracker,
        handlerIDs: [
          WindowTracker.connect('tracked-windows-changed', () =>
            this.refresh('WindowTracker.tracked-windows-changed'),
          ),
        ],
      },
    ]
  }

  disconnectSignals() {
    this.listeners.forEach(({ target, handlerIDs }) => {
      handlerIDs.forEach((id) => target.disconnect(id))
    })
  }

  refresh(data?: string) {
    const activeWorkspace = WorkspaceManager.workspaces.find(
      (workspace) => workspace.active,
    )

    if (activeWorkspace) {
      const activeWindow = activeWorkspace.windows.find(
        (window) => window.active,
      )

      Log('activeWindow', activeWindow?.title)
    }

    Log('SIGNAL', data, WorkspaceManager.length)

    const secondMonitorWindows = WorkspaceManager.workspaces[0].windows.filter(
      (window) => window.isOnSecondMonitor,
    )

    const workspaceInds = WorkspaceManager.workspaces
      .filter(
        (workspace) =>
          workspace.windows.filter((window) => !window.isOnSecondMonitor)
            .length,
      )
      .map((workspace) =>
        this.getWorkspaceInd(
          workspace.windows.filter((window) => !window.isOnSecondMonitor),
        ),
      )
      .concat(this.getWorkspaceInd(secondMonitorWindows))
      .filter(Boolean) as Widget[]

    this.container.destroyChildrens()
    this.container.appendChildrens(workspaceInds)
  }

  getWorkspaceInd(windows: Window[]) {
    if (!windows.length) {
      return
    }

    const windowsWidgets = windows
      .sort((windowA, windowB) => {
        if (windowA.isOnSecondMonitor) {
          return 1
        }

        if (windowB.isOnSecondMonitor) {
          return -1
        }

        return windowB.id - windowA.id
      })
      .map((window) => {
        const windowIcon = window.getIcon(20)

        const classNameDefalut = cl('icon')
        const classNameActive = cl('icon', 'active', {
          second: window.isOnSecondMonitor,
        })

        windowIcon.className = window.active
          ? classNameActive
          : classNameDefalut

        windowIcon.onClick(() => {
          window.activate()
        })

        windowIcon.onMouseEnter(() => {
          windowIcon.className = classNameActive
        })

        windowIcon.onMouseLeave(() => {
          windowIcon.className = window.active
            ? classNameActive
            : classNameDefalut
        })

        if (!window.workspace.active && !window.active) {
          windowIcon.opacity = 0.5
        }

        return windowIcon
      })

    const windowsWidget = new Widget({
      className: cl('workspace', {
        active: windows[0].workspace.active,
      }),
    })
    windowsWidget.appendChildrens(windowsWidgets)
    return windowsWidget
  }
}
