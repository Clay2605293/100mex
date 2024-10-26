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

function iniciarJuego() {
    const equipo1 = document.getElementById('equipo1').value;
    const equipo2 = document.getElementById('equipo2').value;

    if (equipo1 && equipo2) {
        document.getElementById('nombreEquipo1').textContent = equipo1;
        document.getElementById('nombreEquipo2').textContent = equipo2;
        document.getElementById('setup').style.display = 'none';
        document.getElementById('game').style.display = 'block';
        mostrarPregunta();
    }
}

function mostrarPregunta() {
    const pregunta = preguntas[preguntaActual];
    const respuestas = pregunta.respuestas;

    // Mostrar la pregunta en el div correspondiente
    document.getElementById('preguntaActual').textContent = pregunta.pregunta;

    const tablero = document.getElementById('tablero');
    tablero.innerHTML = ''; // Limpiar respuestas anteriores

    respuestas.forEach((respuesta, index) => {
        // Crear el contenedor de la tarjeta y las caras front y back
        const card = document.createElement('div');
        card.classList.add('card', 'tablero-card');

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.textContent = '---'; // Mostrará los números o "???"

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.textContent = `${respuesta.respuesta} - ${respuesta.puntos} puntos`;

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        tablero.appendChild(card);

        // Agregar el evento de clic para voltear la tarjeta
        card.onclick = () => {
            card.classList.toggle('flipped');
            document.getElementById('correctAnswerSound').play();
            puntajeTotal += respuesta.puntos;
            document.getElementById('totalPuntos').textContent = puntajeTotal;
        };
    });
}


function mostrarRespuesta(indice) {
    const respuestaDiv = document.getElementById('tablero').children[indice];
    const respuesta = respuestaDiv.dataset.respuesta;
    const puntos = parseInt(respuestaDiv.dataset.puntos);

    respuestaDiv.textContent = `${respuesta} - ${puntos} puntos`;
    puntajeTotal += puntos;
    document.getElementById('totalPuntos').textContent = puntajeTotal;
}

// Función para mostrar el overlay de strike
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

// Agregar strike al equipo 1
document.getElementById('AgregarStrikeEquipo1').onclick = function () {
    if (strikesEquipo1 < 3) {
        strikesEquipo1++;
        document.getElementById('StrikesEquipo1').textContent = strikesEquipo1;
        mostrarStrike(strikesEquipo1); // Mostrar el número de strikes

        // Reproducir el sonido de strike
        document.getElementById('strikeSound').play();
    } else {
        alert('Equipo 1 ha alcanzado el límite de strikes!');
    }
};

// Agregar strike al equipo 2
document.getElementById('AgregarStrikeEquipo2').onclick = function () {
    if (strikesEquipo2 < 1) {
        strikesEquipo2++;
        document.getElementById('StrikesEquipo2').textContent = strikesEquipo2;
        mostrarStrike(strikesEquipo2); // Mostrar el número de strikes

        // Reproducir el sonido de strike
        document.getElementById('strikeSound').play();
    } else {
        alert('Equipo 2 ha alcanzado el límite de strikes!');
    }
};

// Agregar puntos al equipo 1
document.getElementById('AgregarPuntosEquipo1').onclick = function () {
    puntajeEquipo1 += puntajeTotal;
    document.getElementById('PuntosEquipo1').textContent = puntajeEquipo1;
    puntajeTotal = 0;
    document.getElementById('totalPuntos').textContent = puntajeTotal;
};

// Agregar puntos al equipo 2
document.getElementById('AgregarPuntosEquipo2').onclick = function () {
    puntajeEquipo2 += puntajeTotal;
    document.getElementById('PuntosEquipo2').textContent = puntajeEquipo2;
    puntajeTotal = 0;
    document.getElementById('totalPuntos').textContent = puntajeTotal;
};

// Siguiente ronda
document.getElementById('SiguienteRonda').onclick = function () {
    strikesEquipo1 = 0;
    strikesEquipo2 = 0;
    puntajeTotal = 0;
    document.getElementById('StrikesEquipo1').textContent = strikesEquipo1;
    document.getElementById('StrikesEquipo2').textContent = strikesEquipo2;
    document.getElementById('totalPuntos').textContent = puntajeTotal;

    preguntaActual++;
    if (preguntaActual < preguntas.length) {
        mostrarPregunta();
    } else {
        alert('¡Fin del juego! Los puntajes finales son:\n' +
            `Equipo 1: ${puntajeEquipo1} puntos\nEquipo 2: ${puntajeEquipo2} puntos`);
        preguntaActual = 0;
        puntajeEquipo1 = 0;
        puntajeEquipo2 = 0;
        document.getElementById('PuntosEquipo1').textContent = puntajeEquipo1;
        document.getElementById('PuntosEquipo2').textContent = puntajeEquipo2;
        document.getElementById('setup').style.display = 'block';
        document.getElementById('game').style.display = 'none';
    }
};
