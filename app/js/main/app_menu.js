const { app, BrowserWindow, shell } = require('electron')
const path = require('path')
const url = require('url')

class AppMenu {
  static menu(settings, createWindow) {
    let template = [
      this.shellMenu(createWindow),
      this.editMenu(),
      this.viewMenu(),
      this.windowMenu(),
      this.helpMenu()
    ]

    if (process.platform === 'darwin') {
      template.unshift(this.aboutMenu(settings))
    }

    return template
  }

  static shellMenu(createWindow) {
    return {
      label: 'Shell',
      submenu: [
        {
          label: 'New Window',
          accelerator: 'CmdOrCtrl+N',
          click() { createWindow.call() }
        },
        { type: 'separator' },
        {
          label: 'Split Vertically',
          accelerator: 'CmdOrCtrl+Shift+S',
          click(item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.send('split-vertical')
            }
          }
        },
        {
          label: 'Split Horizontally',
          accelerator: 'CmdOrCtrl+S',
          click(item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.send('split-horizontal')
            }
          }
        },
        { type: 'separator' },
        {
          label: 'New Tab',
          accelerator: 'CmdOrCtrl+T',
          click(item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.send('new-tab')
            }
          }
        }
      ]
    }
  }

  static editMenu() {
    return {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' }
      ]
    }
  }

  static viewMenu() {
    return {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    }
  }

  static windowMenu() {
    let currentMenu = {
      role: 'window',
      submenu: [{ role: 'minimize' }, { role: 'close' }]
    }

    if (process.platform === 'darwin') {
      currentMenu.submenu = [
        { role: 'close' }, { role: 'minimize' },
        { role: 'zoom' }, { type: 'separator' }, { role: 'front' }
      ]
    }

    return currentMenu
  }

  static helpMenu() {
    return {
      role: 'help',
      submenu: [
        {
          label: 'Report Issue',
          click() { shell.openExternal('https://github.com/npezza93/archipelago/issues/new') }
        }
      ]
    }
  }

  static aboutMenu(settings) {
    return {
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { label: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          click: function() {
            if (settings === undefined || settings.isDestroyed()) {
              settings = new BrowserWindow({
                width: 1100,
                height: 600,
                show: true,
                titleBarStyle: 'hidden-inset',
                icon: path.join(__dirname, '../../../assets/png_icon.png')
              })

              settings.loadURL(url.format({
                pathname: path.join(__dirname, '../../settings.html'),
                protocol: 'file:',
                slashes: true
              }))
            }

            settings.focus()
          }
        },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }
  }
}

module.exports = AppMenu