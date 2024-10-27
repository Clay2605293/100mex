let preguntas = [];
let puntajeTotal = 0;
let preguntaActual = 0;
let puntajeEquipo1 = 0;
let puntajeEquipo2 = 0;
let strikesEquipo1 = 0;
let strikesEquipo2 = 0;





// Cargar preguntas desde el archivo JSON
fetch('preguntas.json')
    .then(response => response.json())
    .then(data => {
        preguntas = data;
    });


let preguntasDisponibles = [...preguntas]; // Copia todas las preguntas para usarlas
let preguntasUsadas = JSON.parse(localStorage.getItem('preguntasUsadas')) || []; // Recupera preguntas usadas desde el localStorage

function seleccionarPreguntaAleatoria() {
    if (preguntasDisponibles.length === 0) {
        // Si ya usamos todas las preguntas, restablecemos el ciclo
        preguntasDisponibles = [...preguntas];
        preguntasUsadas = [];
        console.log("Todas las preguntas han sido usadas. Reiniciando ciclo.");
    }

    // Selecciona una pregunta aleatoria
    const indiceAleatorio = Math.floor(Math.random() * preguntasDisponibles.length);
    const preguntaSeleccionada = preguntasDisponibles[indiceAleatorio];

    // Elimina la pregunta seleccionada de las disponibles y agrégala a las usadas
    preguntasDisponibles.splice(indiceAleatorio, 1);
    preguntasUsadas.push(preguntaSeleccionada);

    // Guarda las preguntas usadas en el localStorage
    localStorage.setItem('preguntasUsadas', JSON.stringify(preguntasUsadas));

    // Log en consola de la pregunta seleccionada
    console.log(`Pregunta seleccionada: "${preguntaSeleccionada.pregunta}"`);

    // Log en consola de todas las preguntas usadas hasta ahora
    console.log("Preguntas usadas:", preguntasUsadas.map(p => p.pregunta));

    return preguntaSeleccionada;
}




let puntajeObjetivo = 0;

function iniciarJuego() {
    const equipo1 = document.getElementById('equipo1').value;
    const equipo2 = document.getElementById('equipo2').value;
    puntajeObjetivo = parseInt(document.getElementById('puntajeObjetivo').value) || 0;

    if (equipo1 && equipo2 && puntajeObjetivo > 0) {
        document.getElementById('nombreEquipo1').textContent = equipo1;
        document.getElementById('nombreEquipo2').textContent = equipo2;
        document.getElementById('AgregarPuntosEquipo1').textContent = `Puntos a ${equipo1}`;
        document.getElementById('AgregarPuntosEquipo2').textContent = `Puntos a ${equipo2}`;
        document.getElementById('setupWrapper').style.display = 'none';
        document.getElementById('game').style.display = 'block';
        document.getElementById('jugarSound').play();

        mostrarTransicionRonda(1);
        setTimeout(() => mostrarPregunta(), 3500);
    } else {
        alert("Por favor, completa todos los campos y establece un puntaje para ganar.");
    }
}




const ordenDivs = [1, 3, 5, 7, 2, 4, 6, 8];


function mostrarPregunta() {
    const pregunta = seleccionarPreguntaAleatoria();
    document.getElementById('preguntaActual').textContent = pregunta.pregunta;
    localStorage.setItem('preguntaActual', JSON.stringify(pregunta));

    // Configura las respuestas y puntos en cada tarjeta, hasta un máximo de 8 en el orden especificado
    ordenDivs.forEach((num, i) => {
        const respuestaDivId = `respuesta${num}`;
        const respuestaTextId = `respuestaText${num}`;
        const puntosId = `puntos${num}`;

        const respuestaDiv = document.getElementById(respuestaDivId);
        const respuestaFront = document.getElementById(respuestaTextId);
        const puntosDiv = document.getElementById(puntosId);

        // Restablece la visibilidad y contenido de la tarjeta
        respuestaDiv.style.display = 'block';
        respuestaDiv.classList.remove("flipped");

        if (i < pregunta.respuestas.length) {
            const respuesta = pregunta.respuestas[i];

            // Coloca el número en el frente de la tarjeta
            respuestaFront.textContent = i + 1;

            // Coloca la respuesta y los puntos en el card-back
            puntosDiv.textContent = `${respuesta.respuesta} - ${respuesta.puntos} puntos`;

            // Configurar la tarjeta para voltear al hacer clic
            respuestaDiv.onclick = () => {
                const isFlipped = respuestaDiv.classList.toggle("flipped");

                // Reproducir sonido de respuesta correcta y verificar si se suman puntos
                document.getElementById('correctAnswerSound').play();

                // Sumar puntos solo si no se han asignado en esta ronda
                if (isFlipped && !puntosAsignados) {
                    puntajeTotal += respuesta.puntos;
                    document.getElementById('totalPuntos').textContent = puntajeTotal;
                }
            };
        } else {
            // Si no hay respuesta, asegúrate de que la tarjeta esté vacía pero visible
            respuestaFront.textContent = '';
            puntosDiv.textContent = '';
            puntosDiv.style.display = 'flex';
            respuestaDiv.onclick = null;
            respuestaDiv.classList.remove("flipped");
        }
    });
}




document.getElementById('SiguienteRonda').onclick = function () {
    document.getElementById('jugarSound').play();
    
    // Reinicia strikes y puntaje de la ronda actual
    strikesEquipo1 = 0;
    strikesEquipo2 = 0;
    puntajeTotal = 0;
    puntosAsignados = false;
    actualizarStrikes(1, strikesEquipo1);
    actualizarStrikes(2, strikesEquipo2);
    
    document.getElementById('totalPuntos').textContent = puntajeTotal;

    // Incrementa la pregunta actual o reinicia el juego si llegamos al final
    preguntaActual++;
    if (preguntaActual < preguntas.length) {
        // Muestra la pantalla de transición
        mostrarTransicionRonda(preguntaActual + 1);

        // Limpia las tarjetas antes de mostrar la nueva pregunta
        ordenDivs.forEach((num) => {
            const respuestaDiv = document.getElementById(`respuesta${num}`);
            const respuestaText = document.getElementById(`respuestaText${num}`);
            const puntosDiv = document.getElementById(`puntos${num}`);

            respuestaDiv.classList.remove("flipped"); // Restaura el estado sin voltear
            respuestaText.textContent = ''; // Limpia el frente de la tarjeta
            puntosDiv.textContent = ''; // Limpia la parte trasera de la tarjeta
        });

        // Cargar la nueva pregunta después de la transición
        setTimeout(() => mostrarPregunta(), 3500);
    } else {
        // Fin del juego, muestra resultados finales
        alert('¡Fin del juego! Los puntajes finales son:\n' +
            `Equipo 1: ${puntajeEquipo1} puntos\nEquipo 2: ${puntajeEquipo2} puntos`);

        // Reinicia el juego
        preguntaActual = 0;
        puntajeEquipo1 = 0;
        puntajeEquipo2 = 0;
        document.getElementById('PuntosEquipo1').textContent = puntajeEquipo1;
        document.getElementById('PuntosEquipo2').textContent = puntajeEquipo2;
        document.getElementById('setup').style.display = 'block';
        document.getElementById('game').style.display = 'none';
    }
};



function activarAnimacionFondo() {
    document.body.classList.add('flash');
    setTimeout(() => {
        document.body.classList.remove('flash');
    }, 4200); // Dura 1 segundo la animación
}


function mostrarTransicionRonda(ronda) {
    const transitionScreen = document.getElementById('transitionScreen');
    const roundNumber = document.getElementById('roundNumber');

    // Establece el número de ronda y muestra la pantalla de transición
    roundNumber.textContent = `Ronda ${ronda}`;
    transitionScreen.style.display = 'flex';

    // Oculta la pantalla de transición después de 3 segundos
    setTimeout(() => {
        transitionScreen.style.display = 'none';
    }, 3500);
}





function mostrarStrike(strikes) {
    const overlay = document.getElementById('strikeOverlay');
    const redXContainer = document.getElementById('redXContainer');
    redXContainer.innerHTML = ''; // Limpiar las "X" anteriores

    // Agregar la cantidad de "X" equivalente al número de strikes
    for (let i = 0; i < strikes; i++) {
        const xElement = document.createElement('span');
        xElement.textContent = 'X';
        redXContainer.appendChild(xElement);
    }

    overlay.style.display = 'flex';

    // Ocultar el strike después de un breve momento
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 1100); // Mostrar por 1 segundo
}

function actualizarStrikes(equipo, strikes) {
    const strikeContainer = document.getElementById(`StrikesEquipo${equipo}`);
    const strikeElements = strikeContainer.getElementsByClassName('strike');

    // Cambia el color de los strikes según el número de strikes actuales
    for (let i = 0; i < strikeElements.length; i++) {
        if (i < strikes) {
            strikeElements[i].classList.add('active'); // Activo en rojo
        } else {
            strikeElements[i].classList.remove('active'); // Inactivo en blanco
        }
    }
}

// Agregar strike al equipo 1
document.getElementById('AgregarStrikeEquipo1').onclick = function () {
    if (strikesEquipo1 < 3) {
        strikesEquipo1++;
        actualizarStrikes(1, strikesEquipo1);

        // Mostrar la animación de strike y reproducir el sonido
        mostrarStrike(strikesEquipo1);
        document.getElementById('strikeSound').play();
    } else {
        alert('Equipo 1 ha alcanzado el límite de strikes!');
    }
};

// Agregar strike al equipo 2
document.getElementById('AgregarStrikeEquipo2').onclick = function () {
    if (strikesEquipo2 < 3) {
        strikesEquipo2++;
        actualizarStrikes(2, strikesEquipo2);

        // Mostrar la animación de strike y reproducir el sonido
        mostrarStrike(strikesEquipo2);
        document.getElementById('strikeSound').play();
    } else {
        alert('Equipo 2 ha alcanzado el límite de strikes!');
    }
};


let puntosAsignados = false;


function verificarGanador(equipo, puntaje) {
    if (puntaje >= puntajeObjetivo) {
        const ganadorPantalla = document.getElementById('ganadorPantalla');
        ganadorPantalla.querySelector('h1').textContent = `¡Felicidades, ${equipo}! ¡Ganaron!`;
        ganadorPantalla.style.display = 'flex';
        document.getElementById('victoriaSound').play();
    }
}

// Agregar puntos al equipo 1
document.getElementById('AgregarPuntosEquipo1').onclick = function () {
    puntajeEquipo1 += puntajeTotal;
    document.getElementById('PuntosEquipo1').textContent = puntajeEquipo1;
    puntajeTotal = 0;
    document.getElementById('totalPuntos').textContent = puntajeTotal;
    document.getElementById('triunfoSound').play();
    activarAnimacionFondo();
    puntosAsignados = true;

    verificarGanador(document.getElementById('nombreEquipo1').textContent, puntajeEquipo1);
};

// Agregar puntos al equipo 2
document.getElementById('AgregarPuntosEquipo2').onclick = function () {
    puntajeEquipo2 += puntajeTotal;
    document.getElementById('PuntosEquipo2').textContent = puntajeEquipo2;
    puntajeTotal = 0;
    document.getElementById('totalPuntos').textContent = puntajeTotal;
    document.getElementById('triunfoSound').play();
    activarAnimacionFondo();
    puntosAsignados = true;

    verificarGanador(document.getElementById('nombreEquipo2').textContent, puntajeEquipo2);
};

function reiniciarJuego() {
    // Ocultar la pantalla de ganadores si está visible
    document.getElementById('ganadorPantalla').style.display = 'none';

    // Reiniciar variables de puntaje, strikes y rondas
    puntajeTotal = 0;
    puntajeEquipo1 = 0;
    puntajeEquipo2 = 0;
    strikesEquipo1 = 0;
    strikesEquipo2 = 0;
    puntosAsignados = false;
    preguntaActual = 0; // Reiniciar el contador de rondas

    // Reiniciar la interfaz de puntajes y strikes
    document.getElementById('PuntosEquipo1').textContent = puntajeEquipo1;
    document.getElementById('PuntosEquipo2').textContent = puntajeEquipo2;
    document.getElementById('totalPuntos').textContent = puntajeTotal;

    // Restablecer el texto de la pregunta actual al mensaje de bienvenida
    document.getElementById('preguntaActual').textContent = '¡Bienvenidos al juego!';

    // Limpiar las respuestas en pantalla
    ordenDivs.forEach((num) => {
        const respuestaDiv = document.getElementById(`respuesta${num}`);
        const respuestaText = document.getElementById(`respuestaText${num}`);
        const puntosDiv = document.getElementById(`puntos${num}`);

        // Restablece el estado y contenido de cada tarjeta de respuesta
        respuestaDiv.classList.remove("flipped");
        respuestaText.textContent = '';
        puntosDiv.textContent = '';
    });

    // Restablecer visualmente los strikes para ambos equipos
    actualizarStrikes(1, strikesEquipo1);
    actualizarStrikes(2, strikesEquipo2);

    // Volver a la pantalla de configuración
    document.getElementById('setupWrapper').style.display = 'block';
    document.getElementById('game').style.display = 'none';

    // Reiniciar preguntas disponibles sin borrar las usadas en localStorage
    preguntasDisponibles = preguntas.filter(
        pregunta => !preguntasUsadas.some(usada => usada.pregunta === pregunta.pregunta)
    );

    console.log("Juego reiniciado. Preguntas restantes:", preguntasDisponibles.map(p => p.pregunta));
}





