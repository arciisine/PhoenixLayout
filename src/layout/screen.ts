/// <reference path="../typings/layout.d.ts" />

export default class ScreenLayout {
  screen:Screen;
  units:Size
  padding:number = 0;
  cells:{[cell:string]:Rectangle&{r:number,c:number}}
  name:string;

  constructor(cfg:ScreenLayoutExternal) {
    let items = cfg.format.trim().split('\n').map(x => x.trim().split(''));
    this.units = {width:items[0].length, height: items.length }
    this.cells = {};
    this.padding = cfg.padding || 0;

    for (let r:number = 0; r < this.units.height; r++) {
      for (let c:number = 0; c < this.units.width; c++) {
        let it = items[r][c];
        let cell = this.cells[it] 
        if (!cell) {
          cell = this.cells[it] = {y:r, x:c, width: 1, height: 1, r,c};
        } else {
          cell.width  = Math.max(c - cell.c + 1, cell.width);
          cell.height = Math.max(r - cell.r + 1, cell.height);
        }
      }
    }
    for (var k in cfg.aliases) {
      let cell = this.cells[k];
      if (cell) {
        cfg.aliases[k].forEach(c => this.cells[c] = cell)
      }
    }
  }
  
  layout(cls:string, windows:Window[]) {
    let fr = this.screen.visibleFrameInRectangle();
    let dx = fr.width / this.units.width;
    let dy = fr.height / this.units.height;
    let ox = fr.x
    let oy = fr.y
        
    let cell = this.cells[cls];
    if (!cell) return; // DO nothing if it doesn't match

    windows.forEach(window => {        
      let dims = { 
        x      : ox + (cell.x * dx) + this.padding, 
        y      : oy + (cell.y * dy) + this.padding, 
        width  : cell.width * dx - this.padding * 2,  
        height : cell.height * dy - this.padding * 2 
      }
      window.setFrame(dims);
    });
  }
}