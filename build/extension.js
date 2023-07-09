"use strict";
const { gi: GI, ui: UI, misc: Misc, gettext: Gettext, cairo: Cairo } = imports;
const { Gtk } = GI;
const ExtensionUtils = Misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
function Log(...items) {
    log(`SNILCY ==> ${items.join(' ')} <==`);
}
function init() {
    Log('WorkspaceIndicator.init');
    return new WorkspaceIndicator();
}
const Signals = [
    {
        target: global.workspace_manager,
        signals: [
            'notify::n-workspaces',
            'workspace-switched',
            'workspaces-reordered',
        ],
        listeners: [],
    },
    {
        target: global.display,
        signals: ['restacked', 'window-left-monitor', 'window-entered-monitor'],
        listeners: [],
    },
];
class WorkspaceIndicator {
    enable() {
        Log('WorkspaceIndicator.enable');
        this.connectSignals();
        this.refresh();
    }
    disable() {
        Log('WorkspaceIndicator.disable');
        this.disconnectSignals();
        this.refresh();
    }
    connectSignals() {
        Signals.forEach((group) => {
            group.listeners = group.signals.map((signal) => group.target.connect(signal, this.refresh.bind(this, signal)));
        });
    }
    disconnectSignals() {
        Signals.forEach((group) => {
            group.listeners.forEach((listener) => group.target.disconnect(listener));
            group.listeners = [];
        });
    }
    refresh(data) {
        Log('refresh', data);
    }
}
