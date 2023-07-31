var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/classnames/index.js
var require_classnames = __commonJS({
  "node_modules/classnames/index.js"(exports, module) {
    (function() {
      "use strict";
      var hasOwn = {}.hasOwnProperty;
      var nativeCodeString = "[native code]";
      function classNames() {
        var classes = [];
        for (var i = 0; i < arguments.length; i++) {
          var arg = arguments[i];
          if (!arg)
            continue;
          var argType = typeof arg;
          if (argType === "string" || argType === "number") {
            classes.push(arg);
          } else if (Array.isArray(arg)) {
            if (arg.length) {
              var inner = classNames.apply(null, arg);
              if (inner) {
                classes.push(inner);
              }
            }
          } else if (argType === "object") {
            if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) {
              classes.push(arg.toString());
              continue;
            }
            for (var key in arg) {
              if (hasOwn.call(arg, key) && arg[key]) {
                classes.push(key);
              }
            }
          }
        }
        return classes.join(" ");
      }
      if (typeof module !== "undefined" && module.exports) {
        classNames.default = classNames;
        module.exports = classNames;
      } else if (typeof define === "function" && typeof define.amd === "object" && define.amd) {
        define("classnames", [], function() {
          return classNames;
        });
      } else {
        window.classNames = classNames;
      }
    })();
  }
});

// src/utils.ts
var Log = (...items) => {
  log(`SNILCY.N ==> ${items.join(" ")} <==`);
};

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
      this.containerWidget = typeof this.params.container === "function" ? this.params.container({
        style_class: Config.getClassName(this.params.className || "")
      }) : this.params.container;
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

// src/api/widget-button.ts
var WidgetButton = class extends Widget {
  constructor(params) {
    super({
      ...params,
      container: ({ style_class }) => new St.Button({
        label: String(params.label),
        style_class
      })
    });
  }
};

// src/metadata.json
var uuid = "workspace@snilcy.github.io";

// src/extension.ts
var import_classnames = __toESM(require_classnames());
Config.init({
  cssPrefix: uuid
});
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
    this.container = new Widget({
      className: "root"
    });
    this.refresh();
    Panel.leftBox.appendChildren(this.container, 0);
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
          Display.connect("restacked", () => this.refresh("Display.restacked")),
          Display.connect(
            "window-left-monitor",
            () => this.refresh("Display.window-left-monitor")
          ),
          Display.connect(
            "window-entered-monitor",
            () => this.refresh("Display.window-entered-monitor")
          )
        ]
      },
      {
        target: WindowTracker,
        handlerIDs: [
          WindowTracker.connect(
            "tracked-windows-changed",
            () => this.refresh("WindowTracker.tracked-windows-changed")
          )
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
    const activeWorkspace = WorkspaceManager.workspaces.find(
      (workspace) => workspace.active
    );
    if (activeWorkspace) {
      const activeWindow = activeWorkspace.windows.find(
        (window2) => window2.active
      );
    }
    const secondMonitorWindows = WorkspaceManager.workspaces[0].windows.filter(
      (window2) => window2.isOnSecondMonitor
    );
    const workspaceInds = WorkspaceManager.workspaces.map(
      (workspace) => this.getWorkspaceInd(
        workspace.windows.filter((window2) => !window2.isOnSecondMonitor),
        workspace
      )
    ).concat(this.getWorkspaceInd(secondMonitorWindows)).filter(Boolean);
    this.container.destroyChildrens();
    this.container.appendChildrens(workspaceInds);
  }
  getWorkspaceInd(windows, workspace) {
    const windowsWidgets = windows.sort((windowA, windowB) => {
      if (windowA.isOnSecondMonitor) {
        return 1;
      }
      if (windowB.isOnSecondMonitor) {
        return -1;
      }
      return windowB.id - windowA.id;
    }).map((window2) => {
      const windowIcon = window2.getIcon(20);
      const classNameDefalut = (0, import_classnames.default)("icon");
      const classNameActive = (0, import_classnames.default)("icon", "active", {
        second: window2.isOnSecondMonitor
      });
      windowIcon.className = window2.active ? classNameActive : classNameDefalut;
      windowIcon.onClick(() => {
        window2.activate();
      });
      windowIcon.onMouseEnter(() => {
        windowIcon.className = classNameActive;
      });
      windowIcon.onMouseLeave(() => {
        windowIcon.className = window2.active ? classNameActive : classNameDefalut;
      });
      if (!window2.workspace.active && !window2.active) {
        windowIcon.opacity = 0.5;
      }
      return windowIcon;
    });
    const windowsWidget = new Widget({
      className: (0, import_classnames.default)("workspace", {
        active: workspace?.active
      })
    });
    if (windowsWidgets.length) {
      windowsWidget.appendChildrens(windowsWidgets);
    } else {
      const classNameDefalut = (0, import_classnames.default)("icon", "index");
      const classNameActive = (0, import_classnames.default)(classNameDefalut, "active");
      const indexButton = new WidgetButton({
        label: workspace ? workspace?.index + 1 : "S",
        className: classNameDefalut,
        onClick() {
          workspace?.activate();
        }
      });
      indexButton.onMouseEnter(() => {
        indexButton.className = classNameActive;
      });
      indexButton.onMouseLeave(() => {
        indexButton.className = workspace?.active ? classNameActive : classNameDefalut;
      });
      windowsWidget.appendChildren(indexButton);
    }
    return windowsWidget;
  }
};
