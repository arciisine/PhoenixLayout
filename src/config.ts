let config:Configuration = {
  screens : {
    laptop : {size:'1680x1050'}, 
    vizio  : {size:'3200x1800'},
    tv     : {size:'1920x1080'} 
  },
  classes : {
    browser    : [ {app : 'Google Chrome', windowNot:/^.*(tim@eaiti.com|timothy.soehnlin@gmail.com|Hangouts).*$/}, 'Safari', 'Firefox'],
    terminal   : [{app:'iTerm2', tile:{x:true}}],
    notes      : ['Notes'],
    textEditor : [{app:/^Code.*$/}, 'Sublime Text'],
    ide        : ['Intellij'],
    chat       : ['HipChat'], /*{ app : 'Google Chrome', window : 'Hangouts' }],*/
    email      : [ {app : 'Google Chrome', window:/^.*(tim@eaiti.com|timothy.soehnlin@gmail.com).*$/}],
  },
  layouts : {
    home: {    
      vizio : {
        padding: 3,
        format :
        `aabbbccc
         aabbbccc
         aabbbccc
         dddddccc`,
        aliases : {
          a : ['browser', 'chat'],
          b : ['ide'],
          c : ['textEditor'],
          d : ['terminal']         
        }
      },
      laptop: {
        padding: 3,
        format  : `eef`,
        aliases : {
          e : ['email'],
          f : ['notes']
        }
      }
    },
    mobile: {
      laptop: {
        padding: 3, 
        format  : `aab`,
        aliases : {
          a : ['browser', 'textEditor', 'ide', 'email'],
          b : ['notes', 'terminal', 'chat']
        }
      }
    }
  }
}

export default config;