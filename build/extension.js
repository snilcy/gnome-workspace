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

// src/api/window.ts
var Window = class {
  constructor(gWindow) {
    this.gWindow = gWindow;
  }
  get isOnSecondMonitor() {
    return this.gWindow.is_on_all_workspaces();
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

// src/utils.ts
var Log = (...items) => {
  log(`SNILCY.N ==> ${items.join(" ")} <==`);
};

// src/api/index.ts
var GLib = imports.gi.GLib;
var Gtk = imports.gi.Gtk;
var St = imports.gi.St;
var Main2 = imports.ui.main;

// src/extension.ts
var import_classnames = __toESM(require_classnames());
function init() {
  Log("WorkspaceIndicator.init");
  return new WorkspaceIndicator();
}
var WorkspaceIndicator = class {
  constructor() {
    this.workspaceInds = [];
    this.listeners = [];
  }
  enable() {
    Log("WorkspaceIndicator.enable");
    this.connectSignals();
  }
  disable() {
    Log("WorkspaceIndicator.disable");
    this.disconnectSignals();
    this.refresh();
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
  destroy() {
    this.workspaceInds.forEach((bin) => bin.destroy());
  }
  refresh(data) {
    Log("SIGNAL", data, WorkspaceManager.length);
    this.destroy();
    this.workspaceInds = WorkspaceManager.workspaces.map(this.getWorkspaceInd);
  }
  getWorkspaceInd(workspace) {
    const windows = workspace.windows.filter(
      (w) => (
        // isOtherMonitor ? w.isOnSecondMonitor : !w.isOnSecondMonitor,
        w
      )
    );
    const styles = (0, import_classnames.default)("workspace", {
      active: workspace.active
    });
    const workspaceInd = new St.Bin({
      style_class: styles,
      style: "",
      reactive: true,
      can_focus: true,
      track_hover: true,
      child: new St.BoxLayout()
    });
    workspaceInd.connect("button-release-event", () => workspace.activate());
    Main.panel[box].insert_child_at_index(workspaceIndicator, insertIndex);
    return workspaceInd;
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
