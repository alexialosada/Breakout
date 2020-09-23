/*
* CLASSE PADDLE
 */
class Paddle{
    constructor() {
        this.width = 300;
        this.height = 20;                               // mides
        this.x = game.width/2 - this.width/2;
        this.y = game.height-50;    // posició inicial
        this.vx = 10;       // velocitat = 10 píxels per fotograma
        this.color = "#fbb";    // vermell
    }

    update(){
        if (game.key.RIGHT.pressed) {
            this.x = Math.min(game.width - this.width, this.x + this.vx);
        }
        else if (game.key.LEFT.pressed) {
            this.x = Math.max(0, this.x - this.vx);
        }
    }

    draw (ctx){
        ctx.save();
        ctx.fillStyle=this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    };
}