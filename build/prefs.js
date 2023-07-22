// src/api/index.ts
var GLib = imports.gi.GLib;
var Gtk = imports.gi.Gtk;
var St = imports.gi.St;
var Main = imports.ui.main;

// src/utils.ts
var Log = (...items) => {
  log(`SNILCY.N ==> ${items.join(" ")} <==`);
};

// src/prefs.ts
function init() {
  Log("Prefs.init");
}
function buildPrefsWidget() {
  Log("Prefs.buildPrefsWidget");
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
