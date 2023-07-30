// src/api/config.ts
var ConfigClass = class {
  constructor() {
    this.params = {
      cssPrefix: ""
    };
  }
  init(params) {
    const cssPrefix = (params.cssPrefix || "").replace(/[^a-zA-Z-_]/gi, "-");
    this.params = {
      ...this.params,
      ...params,
      cssPrefix
    };
  }
  getClassName(className) {
    if (!className) {
      return "";
    }
    return [this.params.cssPrefix, className].join("__");
  }
};
var Config = new ConfigClass();

// src/api/st.ts
var St = imports.gi.St;

// src/api/clutter.ts
var Clutter = imports.gi.Clutter;

// src/api/widget.ts
var DEFAULT_CONTAINER = St.BoxLayout;
var Widget = class {
  constructor(params = {}) {
    this.params = {};
    this.params = params;
    if (params.onClick) {
      this.onClick(params.onClick);
    }
    if (params.onMouseEnter) {
      this.onMouseEnter(params.onMouseEnter);
    }
    if (params.onMouseLeave) {
      this.onMouseLeave(params.onMouseLeave);
    }
  }
  get className() {
    return this.container.style_class;
  }
  set className(className) {
    this.container.style_class = className ? Config.getClassName(className) : null;
  }
  get container() {
    if (this.containerWidget) {
      return this.containerWidget;
    }
    if (this.params.container) {
      this.containerWidget = typeof this.params.container === "function" ? this.params.container() : this.params.container;
    } else {
      this.containerWidget = new DEFAULT_CONTAINER({
        reactive: true,
        can_focus: true,
        track_hover: true,
        style_class: Config.getClassName(this.params.className || "")
      });
    }
    if (this.params.children) {
      this.containerWidget.insert_child_at_index(
        this.params.children.container,
        0
      );
    }
    if (this.params.gChildren) {
      this.containerWidget.insert_child_at_index(this.params.gChildren, 0);
    }
    return this.containerWidget;
  }
  appendChildren(widget, index = -1) {
    this.container.insert_child_at_index(widget.container, index);
  }
  appendChildrens(childs) {
    childs.forEach((child) => this.appendChildren(child));
  }
  destroyChildrens() {
    this.container.destroy_all_children();
  }
  destroy() {
    try {
      if (this.container) {
        this.container.destroy();
      }
    } catch (e) {
    }
  }
  set opacity(value) {
    this.container.opacity = 255 * value;
  }
  onClick(handler) {
    this.container.connect(
      "button-release-event",
      (_, event) => {
        handler(event);
      }
    );
  }
  onMouseEnter(handler) {
    this.container.connect("enter-event", (actor, event) => {
      handler(this, event);
    });
  }
  onMouseLeave(handler) {
    this.container.connect("leave-event", (actor, event) => {
      handler(this, event);
    });
  }
  addEffect(effect) {
    switch (effect) {
      case "desaturate":
        this.container.add_effect(new Clutter.DesaturateEffect());
        break;
      default:
        break;
    }
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
  constructor(gWindow, workspace) {
    this.gWindow = gWindow;
    this.workspace = workspace;
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
    const icon = new Widget({
      gChildren: imports.gi.Shell.WindowTracker.get_default().get_window_app(this.gWindow).create_icon_texture(size)
    });
    return icon;
  }
  get active() {
    return this.gWindow.has_focus();
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
var Workspace2 = class {
  constructor(gWorkspace) {
    this.gWorkspace = gWorkspace;
  }
  get windows() {
    return this.gWorkspace.list_windows().map((gWindow) => new Window(gWindow, this));
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
      return new Workspace2(gWorkspace);
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

// src/utils.ts
var Log2 = (...items) => {
  log(`SNILCY.N ==> ${items.join(" ")} <==`);
};

// src/prefs.ts
function init() {
  Log2("Prefs.init");
}
function buildPrefsWidget() {
  Log2("Prefs.buildPrefsWidget");
  const prefsWidget = new Gtk.CenterBox({
    visible: true
  });
  const gridWidget = new Gtk.Grid({
    column_spacing: 80,
    row_spacing: 12,
    visible: true
  });
  prefsWidget.set_center_widget(gridWidget);
  return prefsWidget;
}
