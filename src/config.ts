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
    textEditor : [{app:/^Code.*$/}, 'Sublime Text', 'Microsoft Word'],
    ide        : ['Intellij', 'Microsoft Powerpoint'],
    music      : [ {app :'Google Chrome', window:'Google Play Music'}],
    chat       : ['HipChat'], /*{ app : 'Google Chrome', window : 'Hangouts' }],*/
    email      : [ {app : 'Google Chrome', window:/^.*(tim@eaiti.com|timothy.soehnlin@gmail.com).*$/}],
  },
  layouts : {
    home: {    
      vizio : {
        padding: 3,
        format :
        `bbbbaaaccc
         bbbbaaaccc
         bbbbaaaccc
         ddddaaaeee`,
        aliases : {
          a : ['textEditor'],
          b : ['browser', 'system'],
          c : ['ide'],
          d : ['terminal'],
          e : ['chat']         
        }
      },
      laptop: {
        padding: 3,
        format  : 
          `xxxy
           xxxy
           xxxz`,
        aliases : {
          x : ['email'],
          y : ['notes'],
          z : ['music']
        }
      }
    },
    mobile: {
      laptop: {
        padding: 3, 
        format  : `aab`,
        aliases : {
          a : ['browser', 'textEditor', 'ide', 'email', 'system'],
          b : ['notes', 'terminal', 'chat']
        }
      }
    }
  }
}

export default config;