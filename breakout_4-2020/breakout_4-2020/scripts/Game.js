/*
* CLASSE GAME
 */

class Game {
    constructor(nivell, nomJugador) {
        this.canvas
        this.context;       // context per poder dibuixar en el Canvas
        this.width
        this.height;          // mides del canvas
        this.paddle;   // la raqueta
        this.ball;     // la pilota
        this.mur;
        this.t = 0;      // el temps
        this.nivell = nivell;
        this.encerts = 0;
        this.vides = 4;
        this.jugador = nomJugador;
        this.audio = true;
        $("#audioIcon").click(function(){
            this.audio = !this.audio;
            $("#audioIcon").attr('src', (this.audio) ? "imatges/audioOn.gif" : "imatges/audioOff.gif");
        });
        this.topThree=[];
        // Events del teclat
        this.key = {
            RIGHT: {code: 39, pressed: false},
            LEFT: {code: 37, pressed: false}
        };
        this.contEncerts = document.getElementById("encerts");

    }

    inicialitzar() {
        this.canvas = document.getElementById("game");
        this.width = 50 * 15;  // files de 15 totxos com a màxim
        this.canvas.width = this.width;
        this.height = 25 * 25;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext("2d");

        this.paddle = new Paddle();
        this.ball = new Ball();

        this.mur = new Mur(this.nivell, this.llegirNivells());

        document.getElementById("marcadorDeNivell").innerHTML = "Nivell = " + this.nivell++;
        document.getElementById("nom").innerHTML = "Nom: " + this.jugador;
        this.contEncerts.innerHTML = " Encerts: " + this.encerts;
        if(localStorage.topThree0) this.topThree[0] = localStorage.topThree0;
        if (localStorage.topThree1) this.topThree[1] = localStorage.topThree1;
        if (localStorage.topThree2) this.topThree[2] = localStorage.topThree2;

        document.getElementById("top3").innerHTML = "TOP3:<br><br>";
        for(var i = 0; i <this.topThree.length; i ++){
            this.jugador = this.topThree[i].split("|");
            document.getElementById("top3").innerHTML += this.jugador[1] + + "&nbsp;&nbsp;" + this.jugador[0]+ "<br>";
        }
        // Events per moure la raqueta, amb jQuery
        $(document).on("keydown", {game: this}, function (e) {
            if (e.keyCode == e.data.game.key.RIGHT.code) {
                e.data.game.key.RIGHT.pressed = true;
            } else if (e.keyCode == e.data.game.key.LEFT.code) {
                e.data.game.key.LEFT.pressed = true;
            }
        });
        $(document).on("keyup", {game: this}, function (e) {
            if (e.keyCode == e.data.game.key.RIGHT.code) {
                e.data.game.key.RIGHT.pressed = false;
            } else if (e.keyCode == e.data.game.key.LEFT.code) {
                e.data.game.key.LEFT.pressed = false;
            }
        });

        this.t = new Date().getTime();     // inicialitzem el temps
        requestAnimationFrame(mainLoop);
    }

    update() {
        var dt = Math.min((new Date().getTime() - this.t) / 1000, 1); // temps, en segons, que ha passat des del darrer update
        this.t = new Date().getTime();

        this.paddle.update();    // Moviment de la raqueta
        this.ball.update(dt);    // moviment de la bola, depen del temps que ha passat

    };

    draw() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.mur.draw(this.context);
        this.paddle.draw(this.context);
        this.ball.draw(this.context);
    };

    updateVides(){
        var marcadorVides = document.getElementById("vides");
        marcadorVides.innerHTML = "<br> Vides restants: &nbsp; &nbsp; &nbsp;"
        for(var i=0; i<4; i++){
            if(i<this.vides){
                marcadorVides.innerHTML += "<img src='imatges/corVerd.jpg'>&nbsp";
            }
            else {
                marcadorVides.innerHTML += "<img src='imatges/corVermell.jpg'>&nbsp";
            }
        }
    }

    llegirNivells() {
        this.NIVELLS = [
            {
                colors: {
                    b: "#FFF", // blanc
                    t: "#F77", // taronja
                    c: "#4CF", // blue cel
                    v: "#8D1", // verd
                    e: "#D30", // vermell
                    l: "#00D", // blau
                    r: "#F7B", // rosa
                    g: "#F93", // groc
                    p: "#BBB", // plata
                    d: "#FB4"  // dorat
                },
                totxos: [
                    "",
                    "",
                    "       p       ",
                    "     ttttt     ",
                    "    ccccccc    ",
                    "   vvvvvvvvv   ",
                    "   eeeeeeeee   ",
                    "   lllllllll   ",
                    "   r r r r r   "
                ]
            },
            {
                colors: {
                    b: "#FFF", // blanc
                    t: "#F77", // taronja
                    c: "#4CF", // blue cel
                    v: "#8D1", // verd
                    e: "#D30", // vermell
                    l: "#00D", // blau
                    r: "#F7B", // rosa
                    g: "#F93", // groc
                    p: "#BBB", // plata
                    d: "#FB4"  // dorat
                },
                totxos: [
                    "",
                    "",
                    "  ppp     ppp  ",
                    "  tt       tt  ",
                    "  cc       cc  ",
                    "  vv       vv  ",
                    "  eeeeeeeeeee  ",
                    "  lllllllllll  ",
                    "   r r r r r   ",
                    "      ggg      "
                ]
            },
            {
                colors: {
                    b: "#FFF", // blanc
                    t: "#F77", // taronja
                    c: "#4CF", // blue cel
                    v: "#8D1", // verd
                    e: "#D30", // vermell
                    l: "#00D", // blau
                    r: "#F7B", // rosa
                    g: "#F93", // groc
                    p: "#BBB", // plata
                    d: "#FB4"  // dorat
                },
                totxos: [
                    "",
                    " ddd           ",
                    " pppp          ",
                    " ttttt         ",
                    " cccccc        ",
                    " vvvvvvv       ",
                    " eeeeeeee      ",
                    " lllllllll     ",
                    " rrrrrrrrrr    ",
                    " ggggggggggg   ",
                    " bbbbbbbbbbbb  ",
                    " ddddddddddddd "
                ]
            },
            {
                colors: {
                    r: "#D40000", // vermell
                    g: "#6D8902", // verd
                    y: "#EBAD00"  // groc
                },
                totxos: [
                    "",
                    "     rrrrrr    ",
                    "    rrrrrrrrr  ",
                    "    gggyygy    ",
                    "   gygyyygyyy  ",
                    "   gyggyyygyyy ",
                    "   ggyyyygggg  ",
                    "     yyyyyyy   ",
                    "    ggrggg     ",
                    "   gggrggrggg  ",
                    "  ggggrrrrgggg ",
                    "  yygryrryrgyy ",
                    "  yyyrrrrrryyy ",
                    "    rrr  rrr   ",
                    "   ggg    ggg  ",
                    "  gggg    gggg "
                ]
            }

        ];
        return this.NIVELLS;
    };
}