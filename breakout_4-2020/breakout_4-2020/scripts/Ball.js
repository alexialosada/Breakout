/*
* CLASSE BALL
 */


class Ball {
    constructor() {
        this.x = 0;
        this.y = 0;         // posició del centre de la pilota
        this.vx = 300;
        this.vy = 310;  // velocitat = 300 píxels per segon, cal evitar els 45 graus en el check!!
        this.radi = 10;                 // radi de la pilota
        this.color = "#333";  // gris fosc
        this.trajectoria = {};
    }

    update(dt) {
        var dtXoc;      // temps empleat fins al xoc
        var xoc = false;  // si hi ha xoc en aquest dt
        var k;          // proporció de la trajectoria que supera al xoc
        this.trajectoria.p1 = {x: this.x, y: this.y};
        this.trajectoria.p2 = {x: this.x + this.vx * dt, y: this.y + this.vy * dt};  // nova posició de la bola

        // mirem tots els possibles xocs de la bola
        // Xoc amb la vora de sota de la pista
        if (this.trajectoria.p2.y + this.radi > game.height) {
            // hem perdut l'intent actual, però,
            // en aquest exemple, rebotarem
            k = (this.trajectoria.p2.y + this.radi - game.height) / this.vy;
            // ens col·loquem just tocant la vora de la dreta
            this.x = this.trajectoria.p2.x - k * this.vx;
            this.y = game.height - this.radi;
            dtXoc = k * dt;  // temps que queda

            this.vy = -this.vy;
            xoc = true;
            game.vides --;
            game.updateVides();
        }

        // Xoc amb la vora de dalt de la pista
        if (this.trajectoria.p2.y - this.radi < 0) {
            k = (this.trajectoria.p2.y - this.radi) / this.vy;  // k sempre positiu
            // ens col·loquem just tocant la vora de dalt
            this.x = this.trajectoria.p2.x - k * this.vx;
            this.y = this.radi;
            this.vy = -this.vy;
            dtXoc = k * dt;  // temps que queda
            xoc = true;
        }

        // Xoc amb la vora dreta de la pista
        if (this.trajectoria.p2.x + this.radi > game.width) {
            k = (this.trajectoria.p2.x + this.radi - game.width) / this.vx;
            // ens col·loquem just tocant la vora de la dreta
            this.x = game.width - this.radi;
            this.y = this.trajectoria.p2.y - k * this.vy;
            this.vx = -this.vx;
            dtXoc = k * dt;  // temps que queda
            xoc = true;
        }

        // Xoc amb la vora esquerra de la pista
        if (this.trajectoria.p2.x - this.radi < 0) {
            k = (this.trajectoria.p2.x - this.radi) / this.vx;  // k sempre positiu
            // ens col·loquem just tocant la vora de l'esquerra
            this.x = this.radi;
            this.y = this.trajectoria.p2.y - k * this.vy;
            this.vx = -this.vx;
            dtXoc = k * dt;  // temps que queda
            xoc = true;
        }


        // Xoc amb la raqueta
        if (this.trajectoria.p2.y + this.radi >= game.paddle.y && this.trajectoria.p2.y + this.radi < game.paddle.y + game.paddle.height && this.trajectoria.p2.x + this.radi >= game.paddle.x && this.trajectoria.p2.x + this.radi <= game.paddle.x+game.paddle.width){
            Utilitats.play("sonidos/XOC_PADDLE.wav");
            k=(this.trajectoria.p2.y+this.radi - game.paddle.y)/this.vy;
            this.x=this.trajectoria.p2.x-k*this.vx;
            this.y=game.paddle.y-this.radi;
            dtXoc=k*dt;  // temps que queda
            this.vy = -this.vy;
            xoc=true;
        }
        // Xoc amb el mur
        // xoc amb un totxo
        for(var i = 0; i<game.mur.totxo.length; i++) {
            var totxo = game.mur.totxo[i];
            var pXoc = Utilitats.interseccioSegmentRectangle(this.trajectoria, {
                p: {x: totxo.x - this.radi, y: totxo.y - this.radi},
                w: totxo.w + 2 * this.radi,
                h: totxo.h + 2 * this.radi
            });
            if (pXoc) {
                Utilitats.play("sonidos/TotxoCop.wav");
                game.encerts ++;
                game.contEncerts.innerHTML = " Encerts: " + game.encerts;
                game.mur.totxo.splice(game.mur.totxo.indexOf(totxo), 1);
                xoc = true;
                this.x = pXoc.p.x;
                this.y = pXoc.p.y;
                switch (pXoc.vora) {
                    case "superior":
                    case "inferior":
                        this.vy = -this.vy;
                        break;
                    case "esquerra":
                    case "dreta"   :
                        this.vx = -this.vx;
                        break;
                }
                dtXoc = (Utilitats.distancia(pXoc.p, this.trajectoria.p2) / Utilitats.distancia(this.trajectoria.p1, this.trajectoria.p2)) * dt;
                if(game.mur.totxo.length == 0){
                    if(game.nivell <3){
                        game.nivell ++;
                        game = new Game(document.getElementById("nivell").value, document.getElementById("usuari").value);
                        game.inicialitzar();
                    }
                    else{
                        Utilitats.play("sonidos/Winner.mp3");
                        document.getElementById("felicitacio").innerHTML = "Felicitats!";
                        document.getElementById("felicitacio").style.visibility = "visible";
                        Utilitats.checkTopThree(game.topThree, game.jugador, game.encerts);
                    }
                    return;
                }
            }
        }


        // actualitzem la posició de la bola
        if(game.vides > 0) {
            if (xoc) {
                this.update(dtXoc);  // crida recursiva
            } else {
                this.x = this.trajectoria.p2.x;
                this.y = this.trajectoria.p2.y;
            }
        }else{
            game.nivell = 0;
            game.updateVides();
            document.getElementById("felicitacio").innerHTML = "Has perdut...";
            document.getElementById("felicitacio").style.visibility = "visible";
            Utilitats.checkTopThree(game.topThree, game.jugador, game.encerts);
            Utilitats.play("sonidos/GameLost.mp3");
        }

    }


    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radi, 0, 2 * Math.PI);   // pilota rodona
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}
