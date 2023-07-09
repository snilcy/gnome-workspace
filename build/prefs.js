"use strict";
const { gi: GI, ui: UI, misc: Misc, gettext: Gettext, cairo: Cairo } = imports;
const { Gtk } = GI;
const ExtensionUtils = Misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
function Log(...items) {
    log(`SNILCY ==> ${items.join(' ')} <==`);
}
function init() {
    Log('Prefs.init');
}
function buildPrefsWidget() {
    Log('Prefs.buildPrefsWidget');
    const prefsWidget = new Gtk.CenterBox({
        visible: true,
    });
    const gridWidget = new Gtk.Grid({
        column_spacing: 80,
        row_spacing: 12,
        visible: true,
    });
    prefsWidget.set_center_widget(gridWidget);
    return prefsWidget;
}
