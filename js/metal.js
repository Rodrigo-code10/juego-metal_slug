//Definicion de musica de Fondo
const MusicaFondo=new Audio('src/Audio/Soundtrack.mp3');
MusicaFondo.loop=true;
MusicaFondo.volume=0.3;

//Referencia canvas del escenario principal
const canvas=document.getElementById("lienzo");                 
const ctx=canvas.getContext("2d");

//Referencia del canvas para la vida
const canvasV=document.getElementById("Vidas");                 
const ctv=canvasV.getContext("2d");

//Pal Score
const label_score=document.getElementById("Puntuacion");       

//Carga la imagen de fondo
const fondo=new Image();
fondo.src="src/MetalSlug-Mission1.png";

//Carga la imagen de Marco correiendo
const Run=new Image()
Run.src="src/MarcoCorriendo.png";

//Carga la imagen de Marco Quieto
const Seat=new Image()
Seat.src="src/MarcoQuieto.png";

//Carga la imagen de Marco Dispando
const Crouched=new Image()
Crouched.src="src/MarcoAgachado.png";

//Carga la imagen de Marco Dispando
const Shoot=new Image()
Shoot.src="src/MarcoDisparando.png";

//Carga el imagen de Caja
const Box=new Image()
Box.src="src/Caja.png";

//Carga la imagen de viejito
const Viejo=new Image()
Viejo.src="src/Ayuda.png";

//Carga la imagen de salida del viejito
const Salida=new Image()
Salida.src="src/Salida.png";

//Carga a Soldado 1
const Soldado=new Image()
Soldado.src="src/Soldado.png";

//Carga a MarcoAtras
const Atras=new Image()
Atras.src="src/MarcoAtras.png";

//Posicion de las acciones de MarcoRossi
let posiciones=[];
const anchox=80;
const altoy=250;

// Posiciones para disparo 
let posicionesShoot=[];
const anchoxShoot=130;  
const altoyShoot=250;

//Posiciones del viejo
let posicionesViejo=[];
const anchoxViejo=123;
const altoyViejo=250;

//Posiciones de la salida del viejo
let posicionesSalida=[];
const anchoxSalida=159;
const altoySalida=250;

//Posiciones del soladado
let posicionesSoldado=[];
const anchoxSoldado=268;
const altoySoldado=250;

let indice=0;

//Para imagenes donde MarcoRossi NO dispare
for (let fila=0; fila <6; fila++) {
    posiciones.push([fila*anchox, 0]);
}

//Para imagnes donde MarcoRossi SI dispara
for (let fila=0; fila <6; fila++) {
    posicionesShoot.push([fila*anchoxShoot, 0]);
}

//Para imagenes del viejo
for (let fila=0; fila <9; fila++) {
    posicionesViejo.push([fila*anchoxViejo, 0]);
}

//Para imagenes del viejo
for (let fila=0; fila <8; fila++) {
    posicionesSalida.push([fila*anchoxSalida, 0]);
}

//Para imagenes del Soldado
for (let fila=0; fila <4; fila++) {
    posicionesSoldado.push([fila*anchoxSoldado, 0]);
}

/*Empieza Lógica del juego (CANVAS)  */

//Desplazamiento (MAPA)
let scrollX=0;
const velocidad=5;

//Personaje
let MarcoX=50;
let MarcoY=356;
let VIDAS=3;
const escalaPersonaje=2;
let SCORE=0;
let VelocidadPersonaje=5;
const posicionCamaraMarco=canvas.width*0.35;


const escalaViejo=1.5;
let animacionActiva=false;
let tiempoFrame=0;
const velocidadAnimacion=5;

let teclasPresionadas={};
let ultimaDir="reposo";  // "derecha", "izquierda", "reposo"
let agachado=false;
let disparando=false;
let tiempoDisparo=0;
const duracionDisparo=15;



// Ajustar canvas al tamaño real del contenedor
function ajustarCanvas() {
  const area=document.querySelector(".area");
  canvas.width=area.clientWidth;
  canvas.height=area.clientHeight;
}

window.addEventListener("resize", ajustarCanvas);
ajustarCanvas();


//Cuando la imagen este lista
fondo.onload=() => {
  requestAnimationFrame(actualizar);
};

function actualizar() {
    MusicaFondo.play();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctv.clearRect(0, 0, canvas.width, canvas.height);

    // Calcular escala para que el fondo llene el alto del canvas
    const escala=canvas.height/fondo.height;
    const anchoEscalado=fondo.width * escala;

    // Dibujar fondo desplazado (centrado verticalmente)
    const parteY=(canvas.height-fondo.height*escala) / 2;
    ctx.drawImage(fondo, -scrollX * escala, parteY, anchoEscalado, fondo.height * escala);

    // Seleccionar qué imagen usar según el estado
    if (!disparando && !agachado) {
        if (teclasPresionadas["ArrowRight"] || teclasPresionadas["d"]) {
            animacionActiva=true;
            ultimaDir="derecha";

            const maxScroll=fondo.width-canvas.width / escala;

            if (MarcoX<posicionCamaraMarco) {
                MarcoX+=VelocidadPersonaje;
            } else if (scrollX < maxScroll) {
            
                scrollX+=velocidad;
                if (scrollX > maxScroll)scrollX=maxScroll;
            } else {
                MarcoX+=VelocidadPersonaje;
            }


        } else if (teclasPresionadas["ArrowLeft"] || teclasPresionadas["a"]) {
            animacionActiva=true;
            ultimaDir="izquierda";

            if (MarcoX > 0 && (MarcoX > posicionCamaraMarco || scrollX <= 0)) {
                MarcoX-=VelocidadPersonaje;
                if (MarcoX < 0) MarcoX = 0;
            }else if (scrollX > 0) {
                scrollX -= velocidad;
                if (scrollX < 0) scrollX = 0; // límite del mapa
            } else {
                animacionActiva=false;
            }
        }
    } else {
        animacionActiva=false;
    }

   // Seleccionar qué imagen y posiciones usar según el estado
    let imagenActual;
    let posicionesActuales;
    let anchoActual;
    let altoActual;

    if (disparando) {
        imagenActual=Shoot;
        posicionesActuales=posicionesShoot;
        anchoActual=anchoxShoot;
        altoActual=altoyShoot;
        tiempoDisparo++;

        if (tiempoDisparo >= velocidadAnimacion) {
            tiempoDisparo=0;
            indice++;
            if (indice >= posicionesActuales.length) {
                disparando=false;
                indice=0;
            }
        }
    } else if (agachado) {
        imagenActual=Crouched;  // Cambia a imagen agachado si tienes
        posicionesActuales=posiciones;
        anchoActual=anchox;
        altoActual=altoy;
    } else {
        imagenActual=animacionActiva ? Run : Seat;
        posicionesActuales=posiciones;
        anchoActual=anchox;
        altoActual=altoy;
        
        if (animacionActiva && (ultimaDir=="derecha")) {
            tiempoFrame++;
            if (tiempoFrame >= velocidadAnimacion) {
                tiempoFrame=0;
                indice++;
                if (indice >= posicionesActuales.length) {
                    indice=0;
                }
            }
        } else if (animacionActiva && (ultimaDir=="izquierda")) {
            imagenActual=Atras;
            tiempoFrame++;
            if (tiempoFrame >= velocidadAnimacion) {
                tiempoFrame=0;
                indice++;
                if (indice >= posicionesActuales.length) {
                    indice=0;
                }
            }
        }else {
            indice=0;
        }
    }

    //Dibujar Personaje
    ctx.drawImage(imagenActual, posicionesActuales[indice][0], posicionesActuales[indice][1], anchoActual, altoActual,
        MarcoX, MarcoY, anchoActual * escalaPersonaje, altoActual * escalaPersonaje);

    dibujarObjetos(ctx, escala);

    detectarColisiones(escala);
    
    crearSoldado(escala);

    actualizarSoldados(escala);

    actualizarBalasEnemigos(escala); 

    detectarColisionesBala(escala);

    actualizarBalas(escala); 

    label_score.textContent=SCORE;
    console.log(MarcoX, MarcoY)         
    dibujarCorazonesCentrados(ctv, 3.5, VIDAS, 4);
    requestAnimationFrame(actualizar);
}

document.addEventListener("keydown", (e) => {
    teclasPresionadas[e.key]=true;      //Se guarda en diccioanrio Key, valor
    
    if (e.key == "ArrowDown" ||e.key == 's') {
        agachado=true;
        animacionActiva=false;
        disparando=false;
        indice=0;
    }
    if (e.code == "Space") {         
        disparando=true;
        animacionActiva=false;
        agachado=false;
        indice=0;
        tiempoDisparo=0;

        const posicionBalaxX=MarcoX+(anchox*escalaPersonaje) / 2;
        const posicionBalayY=MarcoY+(altoy*escalaPersonaje) / 4;  // Más hacia arriba
        crearBala(posicionBalaxX, posicionBalayY);
    }
});

document.addEventListener("keyup", (e) => {
    teclasPresionadas[e.key] = false;
    if (e.key == "ArrowDown" || e.key == 's' ) {
        agachado=false;
        indice=0;
        disparando=false;
    }
});



/* Logica de colisiones, creacion de objetos */

/*   Para los objetos, relacion directa con el personaje  */
const velocidadAnimacionSalida=30;
const objetos=[
    { x: 6190, y: 140, tipo: "viejito", ancho: 50, alto: 50, activo: true, animacionSalida: false, indiceSalida: 0, colisionado: false },
    { x: 4100, y: 180, tipo: "caja", ancho: 70, alto: 70, activo: true, colisionado: false},
    { x: 9200, y: 180, tipo: "puerta", ancho: 70, alto: 70, activo: true, colisionado: false },
];

let indiceViejito=0;
let tiempoFrameViejito=0;
const velocidadAnimacionViejito=11;
let tiempoFrameSalida=0;

function dibujarObjetos(ctx, escala) {
    const parteY=(ctx.canvas.height-fondo.height*escala) / 2;

    objetos.forEach((obj) => {
        if (!obj.activo) return;

        const xPantalla=obj.x-scrollX * escala;
        const yPantalla=parteY+obj.y * escala;

        if (xPantalla+obj.ancho *escala > 0 && xPantalla < ctx.canvas.width) {
            switch (obj.tipo) {
                case "caja":
                    ctx.drawImage(Box, xPantalla, yPantalla, obj.ancho, obj.alto);
                    break;
                    
                case "viejito":
                    if (obj.animacionSalida) {
                        tiempoFrameSalida++;

                        obj.x+=6;
                        const escalaSalida=1.3; 

                        if (tiempoFrameSalida >= velocidadAnimacionSalida) {
                            tiempoFrameSalida=0;
                            obj.indiceSalida++;

                            if (obj.indiceSalida >= posicionesSalida.length || obj.x-scrollX * escala > canvas.width) {
                                obj.activo=false; // se va de pantalla
                            }
                        }
                        if (obj.indiceSalida < posicionesSalida.length) {
                            ctx.drawImage(Salida,posicionesSalida[obj.indiceSalida][0],posicionesSalida[obj.indiceSalida][1],
                                anchoxSalida,altoySalida,xPantalla,yPantalla,
                                anchoxSalida * escalaSalida,altoySalida * escalaSalida);
                        }
                    } else {
                        tiempoFrameViejito++;
                        if (tiempoFrameViejito >= velocidadAnimacionViejito) {
                            tiempoFrameViejito=0;
                            indiceViejito++;

                            if (indiceViejito>=posicionesViejo.length) {
                                indiceViejito = 0;
                            }
                        }
                        ctx.drawImage(Viejo, posicionesViejo[indiceViejito][0],posicionesViejo[indiceViejito][1],
                            anchoxViejo,altoyViejo,xPantalla,yPantalla,
                            anchoxViejo * escalaViejo,altoyViejo * escalaViejo );
                    }
                    break;
            }
        }
    });
}

function detectarColisiones(escala) {
    if (agachado) return;
    const parteY=(canvas.height-fondo.height * escala) / 2;
    
    //No tocar
    const marcoXPantalla=MarcoX;
    const marcoYPantalla=MarcoY;
    const marcoAncho=anchox*escalaPersonaje;
    const marcoAlto=altoy*escalaPersonaje;
    
    //OBJETOS 
    objetos.forEach((obj) => {
        if (!obj.activo) return;
        
        const xPantalla=obj.x - scrollX * escala;;
        const yPantalla=parteY + obj.y * escala;
        const objAnchoEscalado=obj.ancho * escala;
        const objAltoEscalado=obj.alto * escala;

        if (marcoXPantalla< xPantalla + objAnchoEscalado &&
            marcoXPantalla + marcoAncho > xPantalla &&
            marcoYPantalla < yPantalla + objAltoEscalado &&
            marcoYPantalla + marcoAlto > yPantalla
        ) {
            manejarColision(obj);
        }

        console.log(marcoXPantalla,marcoYPantalla)
        console.log('a')
        console.log(xPantalla,yPantalla)
    });
    
    enemigos.forEach((soldado) => {
        if (!soldado.activo || soldado.colisionado) return;
        
        const xPantalla=(soldado.xMundo - scrollX) * escala;
        const yPantalla=parteY + soldado.yMundo * escala;
        const anchoEscalado=soldado.ancho * escala;
        const altoEscalado=soldado.alto * escala;
        
        if (
            marcoXPantalla < xPantalla + anchoEscalado &&
            marcoXPantalla + marcoAncho > xPantalla &&
            marcoYPantalla < yPantalla + altoEscalado &&
            marcoYPantalla + marcoAlto > yPantalla
        ) {
            VIDAS-=1;
            soldado.colisionado=true;
            if (VIDAS <= 0) {
                guardarPuntaje(SCORE);
            }
        }
    });
    
    balasEnemigos.forEach((bala) => {
        if (!bala.activa) return;
        
        const xPantalla=(bala.xMundo - scrollX) * escala;
        const yPantalla=parteY + bala.yMundo * escala;
        const radioEscalado=enemigobala * escala;
        
        if (marcoXPantalla < xPantalla + radioEscalado &&
            marcoXPantalla + marcoAncho > xPantalla - radioEscalado &&
            marcoYPantalla < yPantalla + radioEscalado &&
            marcoYPantalla + marcoAlto > yPantalla - radioEscalado
        ) {
            VIDAS-=1;
            bala.activa=false;
            if (VIDAS <= 0) {
                guardarPuntaje(SCORE);
            }
        }
    });
}


function manejarColision(obj) {
    if (obj.colisionado) return;
    
    obj.colisionado=true;
    
    switch (obj.tipo) {
        case "caja":
            SCORE+=100;
            obj.activo=false;
            break;

        case "viejito":
            SCORE += 200;  
            const texto = "Thank you!"
            if (texto.trim() !== '') {
                const utterance=new SpeechSynthesisUtterance(texto); // Creamos una instancia de SpeechSynthesisUtterance
                utterance.lang='en-US'; 
                speechSynthesis.speak(utterance); // Iniciamos la lectura del texto
            }
            // Inicia la animación de salida
            obj.animacionSalida=true;
            obj.indiceSalida=0;
            tiempoFrameSalida=0;
            break;

        case "puerta":
            guardarPuntaje(SCORE);
            break;
    }
}


/*   Para los objetos, que no tiene relacion directa con MarcoRossi  */

//Declarción de balas
const balas=[];
const velocidadBala=10; 
const tamanoBala=15;    

function crearBala(x, y) {
    balas.push({xMundo: x+scrollX, yMundo: y-60, velocidad: velocidadBala, activa: true });    // Convertir posición pantalla a mundo
}

function actualizarBala(bala) {
    bala.xMundo+=bala.velocidad;

    // Desactivar si sale del mapa
    if (bala.xMundo > fondo.width) {
        bala.activa=false;
    }
}

function dibujarBala(ctx, bala) {
    const xPantalla=(bala.xMundo-scrollX); 
    const yPantalla=bala.yMundo;             

    ctx.fillStyle='yellow';
    ctx.beginPath();
    ctx.arc(xPantalla + tamanoBala, yPantalla + tamanoBala, tamanoBala, 0, Math.PI * 2);
    ctx.fill();
}

function actualizarBalas(escala) { 
    for (let i = balas.length - 1; i >= 0; i--) { 
        const bala=balas[i]; 
        if (!bala.activa) { 
            balas.splice(i, 1); 
            continue; 
        } 
        actualizarBala(bala, escala);
        dibujarBala(ctx, bala, escala); 
    }
}

function detectarColisionesBala(escala) {
    const parteY=(canvas.height-fondo.height*escala) / 2;
    
    balas.forEach((bala) => {
    if (!bala.activa) return;

    enemigos.forEach((enemigo) => {
      if (!enemigo.activo) return;

      const xPantalla=(enemigo.xMundo-scrollX)*escala;
      const yPantalla=parteY+enemigo.yMundo*escala;
      const anchoEscalado=enemigo.ancho * escalaSolado * escala;
      const altoEscalado=enemigo.alto * escalaSolado * escala;

      // Detección de colisión simple (rectángulo contra rectángulo)
        if (bala.xMundo > xPantalla &&
            bala.xMundo < xPantalla + anchoEscalado &&
            bala.yMundo > yPantalla &&
            bala.yMundo < yPantalla + altoEscalado
        ) {
            enemigo.vida -= 1;
            bala.activa = false;
            SCORE += 100;

            if (enemigo.vida <= 0) {
                enemigo.activo = false;
                SCORE += 50;
            }
        }
    });
    });
}


// Manejar colisiones de balas
function manejarColisionBala(obj, indexBala) {
    // Desactivar bala
    balas[indexBala].activa=false;

    if (obj.colisionado) return;

    switch (obj.tipo) {
        case "caja":
            break;
        case "enemigo":
            SCORE += 50;
            obj.activo = false;
            obj.colisionado = true;
            break;
        case "viejito":
            break;

        case "puerta":
            break;
    }
}

//Balas enemigas

const configDificultad = {
    tiempoSpawnMinimo: 3000,      // Milisegundos mínimo entre spawns
    tiempoSpawnMaximo: 6000,      // Milisegundos máximo entre spawns
    velocidadSoldado: 2,          // Velocidad de movimiento del soldado
    velocidadBalaSoldado: 15,     // Velocidad de las balas del soldado
    tiempoDisparo: 2000,          // Cada cuánto dispara (milisegundos)
};

const enemigos=[];
const balasEnemigos=[];
const escalaSolado=1.1;
const enemigobala=15;

let ultimoSpawn=0;
let proximoTiempoSpawn=Math.random() * (configDificultad.tiempoSpawnMaximo - configDificultad.tiempoSpawnMinimo) + configDificultad.tiempoSpawnMinimo;

// Índices para animación del soldado
let indiceSoldado=0;
let tiempoFrameSoldado=0;
const velocidadAnimacionSoldado=8;

function crearSoldado(escala) {
    const ahora=Date.now();
    
    if (ahora -ultimoSpawn < proximoTiempoSpawn) return;
    
    // Posición X cerca del borde derecho de la pantalla
    const xMundo=scrollX + canvas.width + Math.random() * 200;
    
    // Posición Y igual que Marco, ajustada para que se vea correctamente
    const yMundo=MarcoY/ escala; 
    
    enemigos.push({xMundo: xMundo,yMundo: yMundo,ancho: anchoxSoldado,alto: altoySoldado,
        velocidad: configDificultad.velocidadSoldado,
        activo: true,
        colisionado: false,
        ultimoDisparo: ahora,
        vida: 2,
        indiceAnimacion: 0,
        tiempoFrame: 0
    });
    ultimoSpawn=ahora;
    proximoTiempoSpawn=Math.random() * (configDificultad.tiempoSpawnMaximo - configDificultad.tiempoSpawnMinimo) + configDificultad.tiempoSpawnMinimo;
}

function actualizarSoldados(escala) {
    const parteY=(canvas.height-fondo.height * escala) / 2;

    for (let i=enemigos.length-1; i >= 0; i--) {
        const soldado=enemigos[i];

        if (!soldado.activo) {
            enemigos.splice(i, 1);
            continue;
        }
        soldado.xMundo-=soldado.velocidad;

        if (soldado.xMundo < scrollX - 100) {
            soldado.activo=false;
            continue;
        }

        // Disparar cada cierto tiempo
        const ahora=Date.now();
        if (ahora-soldado.ultimoDisparo > configDificultad.tiempoDisparo) {
            crearBalaSoldado(soldado.xMundo, soldado.yMundo);
            soldado.ultimoDisparo=ahora;
        }

        soldado.tiempoFrame++;
        if (soldado.tiempoFrame >= velocidadAnimacionSoldado) {
            soldado.tiempoFrame=0;
            soldado.indiceAnimacion++;
            if (soldado.indiceAnimacion >= posicionesSoldado.length) {
                soldado.indiceAnimacion=0;
            }
        }

        // DIBUJAR SOLDADO
        const xPantalla=(soldado.xMundo-scrollX)*escala; 
        const yPantalla=parteY + soldado.yMundo*escala;
        if (xPantalla + soldado.ancho * escala > 0 && xPantalla < canvas.width) {
            ctx.drawImage(Soldado,posicionesSoldado[soldado.indiceAnimacion][0],posicionesSoldado[soldado.indiceAnimacion][1],
                anchoxSoldado,altoySoldado,xPantalla,
                yPantalla,anchoxSoldado * escalaSolado,altoySoldado * escalaSolado);
        }
    }
}

function crearBalaSoldado(x, y) {
    balasEnemigos.push({xMundo: x,yMundo: y + 80, 
        velocidad: -configDificultad.velocidadBalaSoldado,activa: true});
}

function actualizarBalasEnemigos(escala) {
    for (let i=balasEnemigos.length-1; i>=0; i--) {
        const bala=balasEnemigos[i];

        if (!bala.activa) {
            balasEnemigos.splice(i, 1);
            continue;
        }
        bala.xMundo+=bala.velocidad;

        if (bala.xMundo < scrollX-50 || bala.xMundo >scrollX+canvas.width+50) {
            bala.activa=false;
            continue;
        }
        const xPantalla=(bala.xMundo-scrollX) * escala;

        ctx.fillStyle='red';
        ctx.beginPath();
        ctx.arc(xPantalla, 450, enemigobala, 0, Math.PI * 2);
        ctx.fill();
    }
}


/*   LOGICA PARA EL CORAZÓN    */

//Dibuja Cuadrados
function roundRect (ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.closePath()
}

/**
0 = Transparente
1 = Negro
2 = Rojo
3 = Rojo Fuerte
4 = Blanco
**/
const MCORAZON=[
    [0,0,1,1,1,1,0,0,0,1,1,1,1,0,0],
    [0,1,2,2,2,2,1,0,1,2,2,3,3,1,0],
    [1,2,2,4,4,2,2,1,2,2,2,2,3,3,1],
    [1,2,4,4,2,2,2,2,2,2,2,2,2,3,1],
    [1,2,4,2,2,2,2,2,2,2,2,2,2,3,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,3,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,3,3,1],
    [0,1,2,2,2,2,2,2,2,2,2,3,3,1,0],
    [0,0,1,2,2,2,2,2,2,2,3,3,1,0,0],
    [0,0,0,1,2,2,2,2,2,3,3,1,0,0,0],
    [0,0,0,0,1,2,2,2,3,3,1,0,0,0,0],
    [0,0,0,0,0,1,3,3,3,1,0,0,0,0,0],
    [0,0,0,0,0,0,1,3,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
]
const COLORES = {
  0: 'rgba(0,0,0,0)',     // Transparente
  1: '#000000',            // Negro
  2: '#f02d2dff',            // Rojo
  3: '#b10000ff',            // Rojo fuerte
  4: '#ffffff'             // Blanco
}
function corazon(ctx, c, r, size, numero) {
    if (numero == 0) return; // transparente

    const x=c * size;
    const y=r * size;

    ctx.fillStyle=COLORES[numero];
    ctx.fillRect(x, y, size, size);
}

function dibujarCorazon(ctx, size) {
    for (let r=0; r < MCORAZON.length; r++) {
        for (let c=0; c < MCORAZON[r].length; c++) {
            const numero = MCORAZON[r][c];
            corazon(ctx, c, r, size, numero);
        }
    }
}

function dibujarCorazonesCentrados(ctv, size, cantidad, separacion) {
    const anchoCorazon=MCORAZON[0].length * size;
    const altoCorazon=MCORAZON.length * size;
    const anchoTotal=cantidad * anchoCorazon + (cantidad) * separacion;

    // Posición inicial para centrar horizontal y verticalmente
    const startX=(ctv.canvas.width - anchoTotal - 40) / 2;
    const startY=(ctv.canvas.height - altoCorazon) / 2;

    for (let i=0; i < cantidad; i++) {
        ctv.save();
        ctv.translate(startX + i * (anchoCorazon + separacion), startY);
        dibujarCorazon(ctv, size);
        ctv.restore();
    }
}

/* Logica para guardar Score */

function guardarPuntaje(SCORE) {
  let nombre=prompt("¡Juego terminado! Ingresa tu nombre:");
  if (!nombre) nombre="Jugador desconocido";

  // Recuperar lista anterior
  let ranking=JSON.parse(localStorage.getItem("ranking")) || [];

  // Agregar nuevo registro
  ranking.push({nombre: nombre, score: SCORE, fecha: new Date().toLocaleString() });

  // Ordenar de mayor a menor puntuación
  ranking.sort((a,b) => b.score-a.score);

  // Guardar solo los 5 mejores
  ranking=ranking.slice(0, 5);

  // Guardar en localStorage
  localStorage.setItem("ranking", JSON.stringify(ranking));

  alert("Puntaje guardado correctamente.");
  
  //Regresa al menu
  window.location.href="menu.html";
}

function mostrarRanking() {
    const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
    if (ranking.length==0) {
        alert("No hay puntajes guardados todavía.");
        return;
    }
    let mensaje=" MEJORES SCORE DE JUGADORES\n\n";
    ranking.forEach((r, i) => {
        const fecha = r.day || (r.fecha ? r.fecha.split(",")[0] : "—");
        mensaje += `${i+1}. ${r.nombre} — ${r.score} pts (${fecha})\n`;
    });
    alert(mensaje);
}