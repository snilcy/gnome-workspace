// src/utils.ts
var Log = (...items) => {
  log(`SNILCY.N ==> ${items.join(" ")} <==`);
};

// src/api/st.ts
var St = imports.gi.St;

// src/api/widget.ts
var DEFAULT_CONTAINER = St.BoxLayout;
var Widget = class {
  constructor(params = {}) {
    this.params = {};
    Log("Widget.constructor", params);
    this.params = params;
    if (params.onClick) {
      this.onClick(params.onClick);
    }
  }
  get container() {
    if (this.containerWidget) {
      return this.containerWidget;
    }
    if (this.params.container) {
      this.containerWidget = typeof this.params.container === "function" ? this.params.container() : this.params.container;
    } else {
      this.containerWidget = new DEFAULT_CONTAINER();
    }
    if (this.params.children) {
      this.containerWidget.insert_child_at_index(
        this.params.children.container,
        0
      );
    }
    return this.containerWidget;
  }
  appendChildren(widget, index = -1) {
    Log("Widget.appendChildren", widget);
    Log(this.container);
    this.container.insert_child_at_index(widget.container, index);
  }
  appendChildrens(childs) {
    Log("Widget.appendChildrens", childs.length);
    childs.forEach((child) => this.appendChildren(child));
  }
  destroyChildrens() {
    Log("Widget.destroyChildrens");
    this.container.destroy_all_children();
  }
  destroy() {
    Log("Widget.destroy", this.container);
    try {
      if (this.container) {
        this.container.destroy();
      }
    } catch (e) {
    }
  }
  onClick(handler) {
    this.container.connect(
      "button-release-event",
      (_, event) => {
        handler(event);
      }
    );
  }
};

// src/api/panel.ts
var gPanel = imports.ui.main.panel;
var PANEL_BOX_POSITION = /* @__PURE__ */ ((PANEL_BOX_POSITION2) => {
  PANEL_BOX_POSITION2[PANEL_BOX_POSITION2["LEFT"] = 0] = "LEFT";
  PANEL_BOX_POSITION2[PANEL_BOX_POSITION2["CENTER"] = 1] = "CENTER";
  PANEL_BOX_POSITION2[PANEL_BOX_POSITION2["RIGTH"] = 2] = "RIGTH";
  return PANEL_BOX_POSITION2;
})(PANEL_BOX_POSITION || {});
var Panel = {
  leftBox: new Widget({ container: () => gPanel._leftBox }),
  centerBox: new Widget({ container: () => gPanel._centerBox }),
  rightBox: new Widget({ container: () => gPanel._rightBox })
};

// src/api/display.ts
var { display: gDisplay } = global;
var connect = (...args) => {
  return gDisplay.connect(...args);
};
var Display = {
  connect,
  disconnect(id) {
    gDisplay.disconnect(id);
  }
};

// src/api/list.ts
var List = class {
  constructor() {
    this.container = new St2.BoxLayout();
  }
  appendChild(child) {
    this.container.insert_child_above(child, null);
  }
  appendChilds(childs) {
    childs.forEach((child) => {
      this.container.insert_child_above(child, null);
    });
  }
  clear() {
    this.container.destroy_all_children();
  }
  destroy() {
    this.container.destroy();
  }
};

// src/api/window.ts
var Window = class {
  constructor(gWindow) {
    this.gWindow = gWindow;
    this.gWindowTracker = imports.gi.Shell.WindowTracker.get_default();
    this.app = this.gWindowTracker.get_window_app(this.gWindow);
  }
  get isOnSecondMonitor() {
    return this.gWindow.is_on_all_workspaces();
  }
  get id() {
    return this.gWindow.get_id();
  }
  get pid() {
    return this.gWindow.get_pid();
  }
  get role() {
    return this.gWindow.get_role();
  }
  get class() {
    return this.gWindow.get_wm_class();
  }
  get instance() {
    return this.gWindow.get_wm_class_instance();
  }
  get title() {
    return this.gWindow.get_title();
  }
  get description() {
    return this.gWindow.get_description();
  }
  getIcon(size = 20) {
    const icon = new St.Bin({
      reactive: true,
      can_focus: true,
      track_hover: true,
      style_class: "WS__Icon",
      child: imports.gi.Shell.WindowTracker.get_default().get_window_app(this.gWindow).create_icon_texture(size)
    });
    icon.connect("enter-event", () => {
      icon.opacity = 255 * 0.7;
    });
    icon.connect("leave-event", () => {
      icon.opacity = 255 * 1;
    });
    return new Widget({
      container: () => icon
    });
  }
  activate() {
    this.gWindow.activate(global.get_current_time());
  }
  focus() {
    this.gWindow.focus(global.get_current_time());
  }
  raise() {
    this.gWindow.raise();
  }
};

// src/api/workspace.ts
var Workspace = class {
  constructor(gWorkspace) {
    this.gWorkspace = gWorkspace;
  }
  get windows() {
    return this.gWorkspace.list_windows().map((gWindow) => new Window(gWindow));
  }
  get active() {
    return this.gWorkspace.active;
  }
  get index() {
    return this.gWorkspace.index();
  }
  activate() {
    this.gWorkspace.activate(global.get_current_time());
  }
};

// src/api/workspace-manager.ts
var { workspace_manager: gWrokspaceManager } = global;
var connect2 = (...args) => {
  return gWrokspaceManager.connect(...args);
};
var WorkspaceManager = {
  connect: connect2,
  disconnect(id) {
    gWrokspaceManager.disconnect(id);
  },
  get workspaces() {
    const workspaces = [];
    const length = this.length;
    for (let id = 0; id < length; id++) {
      const workspace = this.getWorkspaceById(id);
      if (workspace) {
        workspaces.push(workspace);
      }
    }
    return workspaces;
  },
  getWorkspaceById(id) {
    const gWorkspace = gWrokspaceManager.get_workspace_by_index(id);
    if (gWorkspace) {
      return new Workspace(gWorkspace);
    }
    return null;
  },
  get activeWorkspaceId() {
    return gWrokspaceManager.get_active_workspace_index();
  },
  isActiveWorkspaceId(id) {
    return gWrokspaceManager.get_active_workspace_index() === id;
  },
  get length() {
    return gWrokspaceManager.get_n_workspaces();
  }
};

// src/api/window-tracker.ts
var gWindowTracker = imports.gi.Shell.WindowTracker.get_default();
var connect3 = (...args) => {
  return gWindowTracker.connect(...args);
};
var WindowTracker = {
  connect: connect3,
  disconnect(id) {
    gWindowTracker.disconnect(id);
  }
};

// src/api/index.ts
var GLib = imports.gi.GLib;
var Gtk = imports.gi.Gtk;
var St2 = imports.gi.St;
var Main = imports.ui.main;

// src/extension.ts
function init(meta) {
  Log("WorkspaceIndicator.init", meta);
  return new WorkspaceIndicator();
}
var WorkspaceIndicator = class {
  constructor() {
    this.container = new Widget();
    this.listeners = [];
  }
  enable() {
    Log("WorkspaceIndicator.enable");
    this.connectSignals();
    this.container.destroy();
    this.container = new Widget();
    this.refresh();
    Panel.centerBox.appendChildren(this.container);
  }
  disable() {
    Log("WorkspaceIndicator.disable");
    try {
      if (this.container && this.container.destroy) {
        this.container.destroy();
      }
    } catch (err) {
      Log(err);
    }
    this.disconnectSignals();
  }
  connectSignals() {
    this.listeners = [
      {
        target: WorkspaceManager,
        handlerIDs: [
          WorkspaceManager.connect(
            "notify::n-workspaces",
            () => this.refresh("WorkspaceManager.notify::n-workspaces")
          ),
          WorkspaceManager.connect(
            "workspace-switched",
            () => this.refresh("WorkspaceManager.workspace-switched")
          ),
          WorkspaceManager.connect(
            "workspaces-reordered",
            () => this.refresh("WorkspaceManager.workspaces-reordered")
          )
        ]
      },
      {
        target: Display,
        handlerIDs: [
          // Display.connect('restacked', () => this.refresh('Display.restacked')),
          // Display.connect('window-left-monitor', () =>
          //   this.refresh('Display.window-left-monitor'),
          // ),
          // Display.connect('window-entered-monitor', () =>
          //   this.refresh('Display.window-entered-monitor'),
          // ),
        ]
      },
      {
        target: WindowTracker,
        handlerIDs: [
          // WindowTracker.connect('tracked-windows-changed', () =>
          //   this.refresh('WindowTracker.tracked-windows-changed'),
          // ),
        ]
      }
    ];
  }
  disconnectSignals() {
    this.listeners.forEach(({ target, handlerIDs }) => {
      handlerIDs.forEach((id) => target.disconnect(id));
    });
  }
  refresh(data) {
    Log("SIGNAL", data, WorkspaceManager.length);
    const workspaceInds = WorkspaceManager.workspaces.map(this.getWindowsInds);
    this.container.destroyChildrens();
    this.container.appendChildrens(workspaceInds);
  }
  getWindowsInds(workspace) {
    const windows = workspace.windows.filter((window) => !window.isOnSecondMonitor).map((window) => {
      const icon = window.getIcon(20);
      icon.onClick(() => {
        Log("window.onClick", window.class);
        window.activate();
      });
      return icon;
    });
    const windowsWidget = new Widget();
    windowsWidget.appendChildrens(windows);
    return windowsWidget;
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
};
