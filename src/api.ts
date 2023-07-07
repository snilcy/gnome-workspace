const { gi, ui, misc, gettext, cairo } = imports;

// GJS's Built-in Modules are in the top-level
// See: https://gitlab.gnome.org/GNOME/gjs/wikis/Modules

const Me = ExtensionUtils.getCurrentExtension();

function Log(...items: any[]) {
  log(`SNILCY ==> ${items.join(' ')} <==`);
}

// export function newClutterActor(): Actor {
//   return new Clutter.Actor();
// }

// export function newClutterCanvas(): ClutterCanvas {
//   return new Clutter.Canvas();
// }

// export function newClutterColor(components: {
//   red: number;
//   green: number;
//   blue: number;
//   alpha: number;
// }): ClutterColor {
//   return new Clutter.Color(components);
// }

// export function numWorkspaces(): number {
//   return global.workspace_manager.get_n_workspaces();
// }

// export function workspaceIndex(): number {
//   return global.workspace_manager.get_active_workspace_index();
// }

// export function activateWorkspace(idx: number) {
//   const ws = global.workspace_manager.get_workspace_by_index(idx);
//   ws.activate(global.get_current_time());
// }

// export function moveWindowToWorkspace(win: MetaWindow, idx: number) {
//   const ws = global.workspace_manager.get_workspace_by_index(idx);
//   win.change_workspace_by_index(idx, false);
//   ws.activate_with_focus(win, global.get_current_time());
// }

// export function stableSequence(win: MetaWindow): number {
//   return win.get_stable_sequence();
// }

// export function windowTitle(win: MetaWindow): string {
//   return win.get_title();
// }

// function rect(metaRect: MetaRect): Rect {
//   return {
//     pos: { x: metaRect.x, y: metaRect.y },
//     size: { x: metaRect.width, y: metaRect.height },
//   };
// }

// function size(metaRect: MetaRect): Point {
//   return { x: metaRect.width, y: metaRect.height };
// }

// export function workspaceOffset(win: MetaWindow): Point {
//   return rect(win.get_work_area_current_monitor()).pos;
// }

// // export function windowRect(win: MetaWindow) {
// //   const globalRect = rect(win.get_frame_rect());
// //   return Rect.move(globalRect, Point.scaleConstant(-1, workspaceOffset(win)));
// // }

// export function minimize(win: MetaWindow) {
//   win.minimize();
// }

// export function unminimize(win: MetaWindow) {
//   win.unminimize();
// }

// // export function moveResize(win: MetaWindow, workspaceRect: Rect) {
// //   if (win.get_maximized() !== MaximizeFlags.Neither) {
// //     unmaximize(win);
// //   }
// //   const rect = Rect.move(workspaceRect, workspaceOffset(win));
// //   win.move_resize_frame(true, rect.pos.x, rect.pos.y, rect.size.x, rect.size.y);
// // }

// export function currentWindow(): MetaWindow {
//   return global.display['focus-window'];
// }

// // export function translateEventCoordinates(
// //   point: Point,
// //   win: MetaWindow,
// // ): Point {
// //   return Point.subtract(point, workspaceOffset(win));
// // }

// export function workspaceArea(win: MetaWindow): Point {
//   return size(win.get_work_area_current_monitor());
// }

// export function unmaximize(win: MetaWindow) {
//   win.unmaximize(Meta.MaximizeFlags.VERTICAL | Meta.MaximizeFlags.HORIZONTAL);
// }

// export function maximize(win: MetaWindow) {
//   win.maximize(Meta.MaximizeFlags.VERTICAL | Meta.MaximizeFlags.HORIZONTAL);
// }

// export function getMaximized(win: MetaWindow): boolean {
//   return win.get_maximized() !== MaximizeFlags.Neither;
// }

// const VISIBLE_WINDOW_TYPES = [
//   Meta.WindowType.NORMAL,
//   Meta.WindowType.DIALOG,
//   Meta.WindowType.UTILITY,
// ];

// function listWindows(win?: MetaWindow): Array<MetaWindow> {
//   const display = win == null ? global.display : win.get_display();
//   const screenNo =
//     win == null ? display.get_current_monitor() : win.get_monitor();
//   const windows = display
//     .get_workspace_manager()
//     .get_active_workspace()
//     .list_windows();
//   return windows.filter(function (w: MetaWindow) {
//     return (
//       w.get_monitor() == screenNo &&
//       VISIBLE_WINDOW_TYPES.indexOf(w.get_window_type()) !== -1
//     );
//   });
// }

// export function visibleWindows(): [MetaWindow, Array<MetaWindow>] {
//   const current = currentWindow();
//   const windows = listWindows(current).filter(function (w: MetaWindow) {
//     return !w.minimized;
//   });
//   return [current, windows];
// }

// export function minimizedWindows(): Array<MetaWindow> {
//   return listWindows().filter(function (w: MetaWindow) {
//     return w.minimized;
//   });
// }

// export function activate(win: MetaWindow): void {
//   Main.activateWindow(win, global.get_current_time());
// }

// export function pushModal(actor: Actor): ClutterGrab {
//   return Main.pushModal(actor);
// }

// export function popModal(grab: ClutterGrab): void {
//   Main.popModal(grab);
// }

// export function activateLater(win: MetaWindow): void {
//   GLib.timeout_add(GLib.PRIORITY_DEFAULT, 10, function () {
//     Main.activateWindow(win, global.get_current_time());
//     return false;
//   });
// }

// export function setWindowHidden(win: MetaWindow, hidden: boolean) {
//   const actor = win.get_compositor_private();
//   if (hidden) {
//     actor.hide();
//   } else {
//     actor.show();
//   }
// }
