/*
* CLASSE TOTXO
 */

class Totxo{
    constructor(x,y,w,h,color){
    this.x=x; this.y=y;         // posició, en píxels respecte el canvas
    this.w=w; this.h=h;         // mides
    this.color=color;
    }

    draw (ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeStyle = "#333";
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.restore();
    }
    
};