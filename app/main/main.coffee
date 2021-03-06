{ app, BrowserWindow, Menu, shell } = require('electron')
path                                = require('path')
url                                 = require('url')
AppMenu                             = require('./app_menu')
ConfigFile                          = require('../utils/config_file')
AutoUpdate                          = require('./auto_update')

settings   = null
about      = null
windows    = []
configFile = new ConfigFile()

createWindow = () ->
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    titleBarStyle: 'hidden-inset',
    vibrancy: configFile.contents().vibrancy
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, '../renderer/renderer.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.focus()

  windows.push(win)

  # win.webContents.once 'did-frame-finish-load', () =>
    # if process.platform == 'darwin' || process.platform == 'win32'
      # (new AutoUpdate()).autoCheck()

app.on 'ready', () ->
  createWindow()
  Menu.setApplicationMenu(
    Menu.buildFromTemplate(AppMenu.menu(about, settings, createWindow))
  )
  if (process.platform == 'darwin')
    app.dock.setMenu(Menu.buildFromTemplate(AppMenu.dock(createWindow)))

app.on 'window-all-closed', () ->
  app.quit() if process.platform != 'darwin'

app.on 'activate', () ->
  windowCount = 0
  windows.forEach (win) ->
    windowCount += 1 unless win.isDestroyed()

  createWindow() if windowCount == 0

configFile.on 'change', () ->
  windows.forEach (win) ->
    unless win.isDestroyed()
      win.setVibrancy(configFile.contents().vibrancy)
