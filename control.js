// control.js

function cargarPregunta() {
    // Obtener la pregunta actual desde `localStorage`
    const pregunta = JSON.parse(localStorage.getItem('preguntaActual'));

    if (pregunta) {
        // Mostrar la pregunta en el HTML
        document.getElementById('preguntaTexto').textContent = pregunta.pregunta;

        // Mostrar las respuestas en el HTML
        const listaRespuestas = document.getElementById('listaRespuestas');
        listaRespuestas.innerHTML = ''; // Limpiar respuestas anteriores

        pregunta.respuestas.forEach((respuesta, index) => {
            const respuestaItem = document.createElement('p');
            respuestaItem.textContent = `${index + 1}. ${respuesta.respuesta} - ${respuesta.puntos} puntos`;
            listaRespuestas.appendChild(respuestaItem);
        });
    } else {
        document.getElementById('preguntaTexto').textContent = 'Esperando pregunta...';
    }
}

// Cargar la pregunta actual al abrir la pantalla de control
cargarPregunta();

// Actualizar la pregunta y respuestas cada 2 segundos para mantener la sincronización
setInterval(cargarPregunta, 100);
