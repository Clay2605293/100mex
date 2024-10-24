let preguntas = [];
let puntajeTotal = 0;
let preguntaActual = 0;

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

    for (let i = 0; i < respuestas.length; i++) {
        const respuestaDiv = document.getElementById('respuesta' + (i + 1));
        respuestaDiv.textContent = '---'; // Inicialmente vacío
        respuestaDiv.dataset.respuesta = respuestas[i].respuesta;
        respuestaDiv.dataset.puntos = respuestas[i].puntos;
    }
}

function mostrarRespuesta(indice) {
    const respuestaDiv = document.getElementById('respuesta' + (indice + 1));
    const respuesta = respuestaDiv.dataset.respuesta;
    const puntos = parseInt(respuestaDiv.dataset.puntos);

    respuestaDiv.textContent = `${respuesta} - ${puntos} puntos`;
    puntajeTotal += puntos;
    document.getElementById('totalPuntos').textContent = puntajeTotal;
}
