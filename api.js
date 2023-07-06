// GNOME APIs are under the `gi` namespace (except Cairo)
// See: http://devdocs.baznga.org/
const { Clutter, St, Shell, Gio, GLib, Gtk } = imports.gi;
const {
  main: Main,
  dnd: Dnd,
  modalDialog: ModalDialog,
  panelMenu: PanelMenu,
  popupMenu: PopupMenu,
} = imports.ui;

const { extensionUtils: ExtensionUtils } = imports.misc;

// GJS's Built-in Modules are in the top-level
// See: https://gitlab.gnome.org/GNOME/gjs/wikis/Modules
const Gettext = imports.gettext;
const Cairo = imports.cairo;

const Me = ExtensionUtils.getCurrentExtension();

function Log(...items) {
  log(`SNILCY ==> ${items.join(' ')} <==`);
}
