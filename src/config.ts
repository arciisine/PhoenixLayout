let config:Configuration = {
  screens : {
    laptop : {size:'1680x1050'}
  },
  classes : {
    browser    : [ {app : 'Google Chrome', windowNot:/^(Hangouts|Google Play Music)$/i}, 'Safari', 'Firefox'],
    system     : ['Finder', 'System'],
    terminal   : [{app:'iTerm2'}, 'Terminal'],
    notes      : ['Notes'],
    textEditor : [{app:/^Code.*$/}, 'Sublime Text'],
    office     : ['Microsoft Powerpoint', 'Microsoft Word', 'Microsoft Excel'],
    ide        : ['Intellij'],
    music      : [ {app :'Google Chrome', window:'Google Play Music'}],
    chat       : ['HipChat'], /*{ app : 'Google Chrome', window : 'Hangouts' }],*/
    email      : ['Mail'],
  },
  layouts : {
    simple : {
      laptop: {
        padding: 2,
        format  : `aab`,
        aliases : {
          a : ['browser', 'textEditor', 'ide', 'system', 'office', 'email'],
          b : ['notes', 'terminal', 'chat']
        }
      }
    }
  }
}

export default config;