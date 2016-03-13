let config:Configuration = {
  screens : {
    laptop : {size:'1680x1050'},
    vizio  : {size:'3200x1800'},
    tv     : {size:'1920x1080'}
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
    },
    multi : {
      vizio : {
        padding: 2,
        format :
        `bbbbaaaccc
         bbbbaaaccc
         bbbbaaaccc
         ddddaaaeee`,
        aliases : {
          a : ['textEditor'],
          b : ['browser', 'system'],
          c : ['ide', 'office'],
          d : ['terminal'],
          e : ['chat']
        }
      },
      laptop: {
        padding: 2,
        format  :
          `xxxxxyy
           xxxxxyy
           xxxxxzz`,
        aliases : {
          x : ['email'],
          y : ['notes'],
          z : ['music']
        }
      }
    },
  }
}

export default config;