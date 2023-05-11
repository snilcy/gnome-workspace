const { Gio, Gtk } = imports.gi
const Me = imports.misc.extensionUtils.getCurrentExtension()

function init() {}

function buildPrefsWidget() {
  const settings = imports.misc.extensionUtils.getSettings(
    "org.gnome.shell.extensions.workspaces-indicator-by-open-apps"
  )

  // Create a parent container widget that is auto-centered
  const prefsWidget = new Gtk.CenterBox({
    visible: true,
  })

  // Put contents in a Table-like grid
  const gridWidget = new Gtk.Grid({
    column_spacing: 80,
    row_spacing: 12,
    visible: true,
  })

  prefsWidget.set_center_widget(gridWidget)

  // -------- SETTINGS --------

  let label, widget

	// panel-position
  label = new Gtk.Label({
    label: "Box where the indicator will be inserted",
    hexpand: true,
    halign: Gtk.Align.START,
  })
  widget = new Gtk.ComboBoxText()
  widget.append('LEFT', 'Left')
  widget.append('CENTER', 'Center')
  widget.append('RIGHT', 'Right')
  settings.bind(
    'panel-position',
    widget,
    'active-id',
    Gio.SettingsBindFlags.DEFAULT
  )
  gridWidget.attach(label, 0, 0, 1, 1)
  gridWidget.attach(widget, 1, 0, 1, 1)

	// position
  label = new Gtk.Label({
    label: "Position in panel (index, 0 = first)",
    hexpand: true,
    halign: Gtk.Align.START,
  })
  widget = new Gtk.SpinButton({
    halign: Gtk.Align.END
  })
  widget.set_sensitive(true)
  widget.set_range(0, 50)
  widget.set_value(settings.get_int('position'))
  widget.set_increments(1, 2)
  widget.connect(
    'value-changed',
    w => {
      settings.set_int(
        'position', 
        w.get_value_as_int()
      )
  })
  gridWidget.attach(label, 0, 1, 1, 1)
  gridWidget.attach(widget, 1, 1, 1, 1)

  // info label
  const info = new Gtk.Label({
    label: '<i>Close settings to apply modifications below this label (working on a fix)</i>',
    halign: Gtk.Align.CENTER,
    use_markup: true,
    visible: true,
  })
  gridWidget.attach(info, 0, 2, 2, 1)
	
	// show-focused-app-indicator
  label = new Gtk.Label({
    label: "Show focused app indicator (above app)",
    hexpand: true,
    halign: Gtk.Align.START,
  })
  widget = new Gtk.Switch({
    halign: Gtk.Align.END
  })
  settings.bind(
    "show-focused-app-indicator",
    widget,
    "active",
    Gio.SettingsBindFlags.DEFAULT
  )
  gridWidget.attach(label, 0, 3, 1, 1)
  gridWidget.attach(widget, 1, 3, 1, 1)

	// show-active-workspace-indicator
  label = new Gtk.Label({
    label: "Show active workspace indicator (under workspace)",
    hexpand: true,
    halign: Gtk.Align.START,
  })
  widget = new Gtk.Switch({
    halign: Gtk.Align.END
  })
  settings.bind(
    "show-active-workspace-indicator",
    widget,
    "active",
    Gio.SettingsBindFlags.DEFAULT
  )
  gridWidget.attach(label, 0, 4, 1, 1)
  gridWidget.attach(widget, 1, 4, 1, 1)

	// reduce-inactive-apps-opacity
  label = new Gtk.Label({
    label: "Reduce inactive apps opacity",
    hexpand: true,
    halign: Gtk.Align.START,
  })
  widget = new Gtk.Switch({
    halign: Gtk.Align.END
  })
  settings.bind(
    "reduce-inactive-apps-opacity",
    widget,
    "active",
    Gio.SettingsBindFlags.DEFAULT
  )
  gridWidget.attach(label, 0, 5, 1, 1)
  gridWidget.attach(widget, 1, 5, 1, 1)

	// round-indicators-border
  label = new Gtk.Label({
    label: "Round indicators border",
    hexpand: true,
    halign: Gtk.Align.START,
  })
  widget = new Gtk.Switch({
    halign: Gtk.Align.END
  })
  settings.bind(
    "round-indicators-border",
    widget,
    "active",
    Gio.SettingsBindFlags.DEFAULT
  )
  gridWidget.attach(label, 0, 6, 1, 1)
  gridWidget.attach(widget, 1, 6, 1, 1)



  // -------- LINKS --------

  const github = new Gtk.Label({
    label: `<a href="https://github.com/Favo02/workspaces-by-open-apps">GitHub source code</a>`,
    halign: Gtk.Align.CENTER,
    use_markup: true,
    visible: true,
  })
  gridWidget.attach(github, 0, 15, 2, 1)

  const issue = new Gtk.Label({
    label: `<a href="https://github.com/Favo02/workspaces-by-open-apps/issues">Report a bug / Feature request</a>`,
    halign: Gtk.Align.CENTER,
    use_markup: true,
    visible: true,
  })
  gridWidget.attach(issue, 0, 16, 2, 1)

  return prefsWidget
}
