

//////////////////////////////////////////////////////////////////////
// Comença el programa
var game;                // l'única variable global és el joc
$(document).ready(function(){
	$("#playButton").click(function () {
		document.getElementById('principal').style.display='block';
		document.getElementById('pantallaInicial').style.display='none';
		game = new Game(document.getElementById("nivell").value, document.getElementById("usuari").value);
		game.inicialitzar();
		document.getElementById('sound').loop = false;

	})
	$("#nivellAmunt").click(function () {
		game = new Game((game.nivell+1)%4, game.jugador);  	   // Inicialitzem la instància del joc
		game.inicialitzar();   // estat inicial del joc
	})
	$("#nivellAbaix").click(function () {
		if(game.nivell == 0) game.nivell = 4;
		game = new Game(game.nivell-1, game.jugador);  	   // Inicialitzem la instància del joc
		game.inicialitzar();   // estat inicial del joc
	})
	$("#audioIcon1").click(function() {
		var sound = document.getElementById('sound');
		var soundSource = document.getElementById('soundSource');
		if (document.getElementById("audioIcon1").src.lastIndexOf("imatges/audioOff.gif")!=-1) {
			sound.loop = true;
			sound.load();
			sound.play();
			$("#audioIcon1").attr('src',"imatges/audioOn.gif");
		} else {
			sound.pause();
			$("#audioIcon1").attr('src', "imatges/audioOff.gif");
		}
	});
	$("#audioIcon").click(function() {
		var sound = document.getElementById('sound');
		var soundSource = document.getElementById('soundSource');
		if (document.getElementById("audioIcon").src.lastIndexOf("imatges/audioOff.gif")!=-1) {
			sound.loop = true;
			sound.load();
			sound.play();
			$("#audioIcon1").attr('src',"imatges/audioOn.gif");
		} else {
			sound.pause();
			$("#audioIcon1").attr('src', "imatges/audioOff.gif");
		}
	});
});

function mainLoop(){
    game.update();
    game.draw();
		requestAnimationFrame(mainLoop);
}

//////////////////////////////////////////////////////////////////////
//                             Utilitats                            //
//////////////////////////////////////////////////////////////////////
var Utilitats={};

Utilitats.addPaddingZeros = function(number){
	while(number.length < 5){ number = "0" + number;}
	return number;
}

Utilitats.checkTopThree=function(topThree, playerName, playerScore){
	playerScore = Utilitats.addPaddingZeros(playerScore.toString());
	topThree[topThree.length] = playerScore + "|" +playerName;
	topThree.sort();
	topThree.reverse();

	localStorage.topThree0 = topThree[0];
	if (topThree[1]) {
		localStorage.topThree1 = topThree[1];
	}
	if (topThree[2]) {
		localStorage.topThree2 = topThree[2];
	}

	document.getElementById("top3").innerHTML = " Top3:<br><br>";
	for (var i=0; i<topThree.length && i<3; i++) {
		jugador = topThree[i].split("|");
		document.getElementById("top3").innerHTML += jugador[1] + "&nbsp;&nbsp;" + jugador[0] + "<br>";
	}
}
Utilitats.play=function(source) {
	if (!game || game.audio) {
		var sound = document.getElementById('sound');
		var soundSource = document.getElementById('soundSource');
		soundSource.src = source;
		sound.load();
	}
}

Utilitats.puntInterseccio=function (p1,p2,p3,p4){
	// converteix segment1 a la forma general de recta: Ax+By = C
	var a1 = p2.y - p1.y;
	var b1 = p1.x - p2.x;
	var c1 = a1 * p1.x + b1 * p1.y;
	
	// converteix segment2 a la forma general de recta: Ax+By = C
	var a2 = p4.y - p3.y;
	var b2 = p3.x - p4.x;
	var c2 = a2 * p3.x + b2 * p3.y;
	
	// calculem el punt intersecció		
	var d = a1*b2 - a2*b1;
	
	// línies paral·leles quan d és 0
	if (d == 0) {
		return false;
	}
	else {
		var x = (b2*c1 - b1*c2) / d;
		var y = (a1*c2 - a2*c1) / d;
		var puntInterseccio={x:x, y:y};	// aquest punt pertany a les dues rectes	
  	if(Utilitats.contePunt(p1,p2,puntInterseccio) && Utilitats.contePunt(p3,p4,puntInterseccio) )
		   return puntInterseccio;
	}
}

Utilitats.contePunt=function(p1,p2, punt){
	return (valorDinsInterval(p1.x, punt.x, p2.x) || valorDinsInterval(p1.y, punt.y, p2.y)); 
	
	// funció interna
	function valorDinsInterval(a, b, c) {  
	  // retorna cert si b està entre a i b, ambdos exclosos
	  if (Math.abs(a-b) < 0.000001 || Math.abs(b-c) < 0.000001) { // no podem fer a==b amb valors reals!!
		  return false;
	  }
  	return (a < b && b < c) || (c < b && b < a);
  }
}


Utilitats.distancia = function(p1,p2){
	return Math.sqrt((p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y));
}

Utilitats.interseccioSegmentRectangle = function(seg,rect){  // seg={p1:{x:,y:},p2:{x:,y:}}
                                                             // rect={p:{x:,y:},w:,h:}
		var pI, dI, pImin, dImin=Infinity, vora;
		// vora superior
		pI=Utilitats.puntInterseccio(seg.p1, seg.p2, 
															{x:rect.p.x,y:rect.p.y}, {x:rect.p.x+rect.w, y:rect.p.y}); 
		if(pI){
			dI=Utilitats.distancia(seg.p1, pI);
			if(dI<dImin){
				dImin=dI;
				pImin=pI;
				vora="superior";
			}
		}
		// vora inferior
		pI=Utilitats.puntInterseccio(seg.p1, seg.p2, 
															 {x:rect.p.x+rect.w, y:rect.p.y+rect.h},{x:rect.p.x, y:rect.p.y+rect.h}); 
		if(pI){
			dI=Utilitats.distancia(seg.p1, pI);
			if(dI<dImin){
				dImin=dI;
				pImin=pI;
				vora="inferior";
			}
		}

		// vora esquerra
		pI=Utilitats.puntInterseccio(seg.p1, seg.p2, 
															  {x:rect.p.x, y:rect.p.y+rect.h},{x:rect.p.x,y:rect.p.y}); 
		if(pI){
			dI=Utilitats.distancia(seg.p1, pI);
			if(dI<dImin){
				dImin=dI;
				pImin=pI;
				vora="esquerra";
			}
		}
		// vora dreta
		pI=Utilitats.puntInterseccio(seg.p1, seg.p2, 
															 {x:rect.p.x+rect.w, y:rect.p.y}, {x:rect.p.x+rect.w, y:rect.p.y+rect.h});
		if(pI){
			dI=Utilitats.distancia(seg.p1, pI);
			if(dI<dImin){
				dImin=dI;
				pImin=pI;
				vora="dreta";
			}
		}
				
		if(vora){
			return {p:pImin,vora:vora}
		}
}





