class Mur{

    constructor(nivell, mur) {
        this.totxo = [];
        var mur = mur[nivell];
        var totxos = mur.totxos;

        for(var f = 0; f < totxos.length; f++){
            var fila = totxos[f];
            for(var c = 0; c < fila.length; c++){
                var color = fila.charAt(c);
                if(color != " "){
                    this.totxo.push(new Totxo(c*50, f*25, 50, 25, mur.colors[color]));
                }
            }
        }
    }

    draw(ctx){
        for(var i = 0; i < this.totxo.length; i++){
            if(this.totxo[i] != null) this.totxo[i].draw(ctx);
        }
    }
}