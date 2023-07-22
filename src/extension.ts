import { Display } from './api/display'
import { WorkspaceManager } from './api/workspace-manager'
import { WindowTracker } from './api/window-tracker'
import { Log } from './utils'
import { St } from './api'
import { Workspace } from './api/workspace'
import type ISt from 'st-12'
import cl from 'classnames'

// import { Display, Log, St, WorkspaceManager } from './api';
// // import type { IStWidget } from './types/gnome-api/st';

// initialize extension
function init() {
  Log('WorkspaceIndicator.init')
  return new WorkspaceIndicator()
}

class WorkspaceIndicator {
  workspaceInds: ISt.Bin[] = []
  listeners: {
    target: { disconnect(handlerID: number): void }
    handlerIDs: number[]
  }[] = []

  enable() {
    Log('WorkspaceIndicator.enable')
    // this._settings = imports.misc.extensionUtils.getSettings(
    //   'org.gnome.shell.extensions.workspace-gnome',
    // );
    // this._workspacesIndicators = [];
    // this._hasOtherMonitor = false;
    this.connectSignals()
    // this.refresh();
  }

  disable() {
    Log('WorkspaceIndicator.disable')

    // this._settings = {};

    // this._workspacesIndicators.splice(0).forEach((i) => i.destroy());
    // this._workspacesIndicators = [];
    // this._hasOtherMonitor = null;

    this.disconnectSignals()
    this.refresh()
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

  destroy() {
    this.workspaceInds.forEach((bin) => bin.destroy())
  }

  refresh(data?: string) {
    Log('SIGNAL', data, WorkspaceManager.length)
    this.destroy()

    // check if apps on all workspaces (other monitor)
    // const windows = global.workspace_manager
    //   .get_workspace_by_index(0)
    //   .list_windows()
    //   .filter((w) => w.is_on_all_workspaces());

    // if (windows && windows.length > 0) {
    //   this._hasOtherMonitor = true;
    //   this.createIndicatorButton(0, true);
    // }

    this.workspaceInds = WorkspaceManager.workspaces.map(this.getWorkspaceInd)
  }

  getWorkspaceInd(workspace: Workspace) {
    const windows = workspace.windows.filter(
      (w) =>
        // isOtherMonitor ? w.isOnSecondMonitor : !w.isOnSecondMonitor,
        w,
    )

    // const showActiveWorkspaceIndicator = this._settings.get_boolean(
    //   'show-active-workspace-indicator',
    // );
    // const roundIndicatorsBorder = this._settings.get_boolean(
    //   'round-indicators-border',
    // );

    const styles = cl('workspace', {
      active: workspace.active,
    })

    // if (!showActiveWorkspaceIndicator) {
    //   styles += ' no-indicator';
    // }
    // if (!roundIndicatorsBorder) {
    //   styles += ' no-rounded';
    // }

    // const indicatorsColor = this._settings.get_string('indicators-color');

    const workspaceInd = new St.Bin({
      style_class: styles,
      style: '',
      reactive: true,
      can_focus: true,
      track_hover: true,
      child: new St.BoxLayout(),
    })

    // // drag and drop
    // workspaceIndicator._delegate = workspaceIndicator;

    // workspaceIndicator._workspaceIndex = index;

    // workspaceIndicator.acceptDrop = function (source) {
    //   if (source._workspaceIndex !== this._workspaceIndex) {
    //     source._window.change_workspace_by_index(this._workspaceIndex, false);
    //     source._window.activate(global.get_current_time());
    //     return true;
    //   }
    //   return false;
    // };

    // switch to workspace on click
    workspaceInd.connect('button-release-event', () => workspace.activate())

    // // assign to "this" settings otherwise function triggered on connect can't access them
    // workspaceIndicator.scrollWrap =
    //   this._settings.get_boolean('scroll-wraparound');
    // workspaceIndicator.inverseScroll =
    //   this._settings.get_boolean('inverse-scroll');
    // // scroll workspaces on mousewhell scroll
    // workspaceIndicator.connect(
    //   'scroll-event',
    //   this.scrollWorkspace.bind(workspaceIndicator),
    // );

    // // create apps icons
    // this.createIndicatorIcons(workspaceIndicator, windows, index);

    // const showWorkspaceIndex = this._settings.get_boolean(
    //   'show-workspace-index',
    // );
    // if (showWorkspaceIndex || isOtherMonitor) {
    //   this.createIndicatorLabel(
    //     workspaceIndicator,
    //     index,
    //     isOtherMonitor
    //       ? this._settings.get_string('apps-on-all-workspaces-indicator')
    //       : null,
    //   );
    // }

    // // add to panel
    // let box;
    // switch (this._settings.get_enum('panel-position')) {
    //   case 0:
    //     box = '_leftBox';
    //     break;
    //   case 1:
    //     box = '_centerBox';
    //     break;
    //   case 2:
    //     box = '_rightBox';
    //     break;
    // }

    // const position = this._settings.get_int('position');

    // // index to insert indicator in panel
    // const insertIndex = isOtherMonitor
    //   ? 0
    //   : position + index + (this._hasOtherMonitor ? 1 : 0);
    // Main.panel[box].insert_child_at_index(workspaceIndicator, insertIndex)

    return workspaceInd
  }

  // createIndicatorIcons(button, windows, index) {
  //   // windows
  //   //   .sort((w1, w2) => w1.get_id() - w2.get_id()) // sort by ids
  //   //   .forEach((win) => {
  //   //     // convert from Meta.window to Shell.app
  //   //     const app = Shell.WindowTracker.get_default().get_window_app(win);
  //   //     if (!app || !win) {
  //   //       return;
  //   //     }
  //   //     // create Clutter.actor
  //   //     const texture = app.create_icon_texture(20);
  //   //     // set low opacity for not focused apps
  //   //     const reduceInactiveAppsOpacity = this._settings.get_boolean(
  //   //       'reduce-inactive-apps-opacity',
  //   //     );
  //   //     if (!win.has_focus() && reduceInactiveAppsOpacity) {
  //   //       texture.set_opacity(150);
  //   //     }
  //   //     const desaturateApps = this._settings.get_boolean('desaturate-apps');
  //   //     if (desaturateApps) {
  //   //       texture.add_effect(new Clutter.DesaturateEffect());
  //   //     }
  //   //     // create container (with texture as child)
  //   //     const showFocusedAppIndicator = this._settings.get_boolean(
  //   //       'show-focused-app-indicator',
  //   //     );
  //   //     const roundIndicatorsBorder = this._settings.get_boolean(
  //   //       'round-indicators-border',
  //   //     );
  //   //     let styles = 'app';
  //   //     if (win.has_focus()) {
  //   //       styles += ' active';
  //   //     }
  //   //     if (!showFocusedAppIndicator) {
  //   //       styles += ' no-indicator';
  //   //     }
  //   //     if (!roundIndicatorsBorder) {
  //   //       styles += ' no-rounded';
  //   //     }
  //   //     const indicatorsColor = this._settings.get_string('indicators-color');
  //   //     const icon = new St.Bin({
  //   //       style_class: styles,
  //   //       style: `border-color: ${indicatorsColor}`,
  //   //       reactive: true,
  //   //       can_focus: true,
  //   //       track_hover: true,
  //   //       child: texture,
  //   //     });
  //   //     // focus application on click
  //   //     icon.middleClosesApp = this._settings.get_boolean(
  //   //       'middle-click-close-app',
  //   //     );
  //   //     icon.connect('button-release-event', this.clickApplication.bind(icon));
  //   //     // drag and drop
  //   //     icon._workspaceIndex = index;
  //   //     icon._window = win;
  //   //     icon._delegate = icon;
  //   //     icon._draggable = dnd.makeDraggable(icon, {
  //   //       dragActorOpacity: 150,
  //   //     });
  //   //     // add app Icon to buttons
  //   //     button.get_child().add_child(icon);
  //   //   });
  // }

  // createIndicatorLabel(button, index, otherMonitorText) {
  //   // const txt = otherMonitorText ?? (index + 1).toString();
  //   // button.get_child().insert_child_at_index(
  //   //   new St.Label({
  //   //     text: txt,
  //   //     style_class: 'text',
  //   //   }),
  //   //   0,
  //   // );
  // }

  // clickApplication(actor, event) {
  //   // left/right click: focus application
  //   // if (event.get_button() === 1 || event.get_button() === 3) {
  //   //   this._window.activate(global.get_current_time());
  //   // }
  //   // // middle click: close application
  //   // if (this.middleClosesApp && event.get_button() === 2) {
  //   //   this._window.delete(global.get_current_time());
  //   // }
  // }

  // scrollWorkspace(actor, event) {
  //   const scrollDirection = event.get_scroll_direction();
  //   let direction = 0;

  //   switch (scrollDirection) {
  //     case Clutter.ScrollDirection.LEFT:
  //     case Clutter.ScrollDirection.UP:
  //       direction = this.inverseScroll ? -1 : 1;
  //       break;
  //     case Clutter.ScrollDirection.RIGHT:
  //     case Clutter.ScrollDirection.DOWN:
  //       direction = this.inverseScroll ? 1 : -1;
  //       break;
  //     default:
  //       return Clutter.EVENT_PROPAGATE;
  //   }

  //   const workspaceManager = global.workspace_manager;

  //   let newIndex = workspaceManager.get_active_workspace_index() + direction;

  //   // wrap
  //   const wrap = this.scrollWrap;
  //   if (wrap) newIndex = mod(newIndex, workspaceManager.n_workspaces);

  //   if (newIndex >= 0 && newIndex < workspaceManager.n_workspaces) {
  //     workspaceManager
  //       .get_workspace_by_index(newIndex)
  //       .activate(global.get_current_time());
  //   }

  //   // modulo working for negative numbers
  // }
}
