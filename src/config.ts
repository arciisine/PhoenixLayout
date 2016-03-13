let config:Configuration = {
  screens : {
    laptop : {size:'1680x1050'}, 
    vizio  : {size:'3200x1800'},
    tv     : {size:'1920x1080'} 
  },
  classes : {
    browser    : [ {app : 'Google Chrome', windowNot:/^((.*(tim@eaiti.com|timothy.soehnlin@gmail.com).*)|Hangouts|Google Play Music)$/i}, 'Safari', 'Firefox'],
    system     : ['Finder', 'System'],
    terminal   : [{app:'iTerm2'}],
    notes      : ['Notes'],
    textEditor : [{app:/^Code.*$/}, 'Sublime Text'],
    office     : ['Microsoft Powerpoint', 'Microsoft Word', 'Microsoft Excel'],
    ide        : ['Intellij'],
    music      : [ {app :'Google Chrome', window:'Google Play Music'}],
    chat       : ['HipChat'], /*{ app : 'Google Chrome', window : 'Hangouts' }],*/
    email      : [ {app : 'Google Chrome', window:/^.*(tim@eaiti.com|timothy.soehnlin@gmail.com).*$/}],
  },
  layouts : {
    home: {    
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
    mobile: {
      laptop: {
        padding: 2, 
        format  : `aab`,
        aliases : {
          a : ['browser', 'textEditor', 'ide', 'system', 'office'],
          b : ['notes', 'terminal', 'email', 'chat']
        }
      }
    }
  }
}

export default config;