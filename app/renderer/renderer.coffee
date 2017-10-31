{ ipcRenderer } = require('electron')
Split           = require('./split')
ConfigFile      = require('../js/config_file')

require('./archipelago_tab')
require('./archipelago_terminal')

configFile = new ConfigFile()

window.addEventListener 'resize', () =>
  document.querySelectorAll('.tab-container:not(.hidden) archipelago-terminal').each (terminal) =>
    terminal.fit()

document.addEventListener 'DOMContentLoaded', () =>
  setDocumentSettings()

  newTab()

newTab = ->
  document.querySelector('#titlebar').appendChild(document.createElement('archipelago-tab'))

setDocumentSettings = ->
  element = document.documentElement

  element.style.setProperty('--font-family', configFile.activeSettings().fontFamily)
  element.style.setProperty('--font-size', configFile.activeSettings().fontSize)
  element.style.setProperty('--background-color', configFile.activeSettings().windowBackground)

configFile.on('change', setDocumentSettings)

ipcRenderer.on 'new-tab', newTab
ipcRenderer.on 'split-horizontal', () =>
  (new Split('horizontal')).split()
ipcRenderer.on 'split-vertical', () =>
  (new Split('vertical')).split()
