import { estadisticas } from "./api.js";

const $ = selector => document.querySelector(selector);

function mostrarMensaje(texto, esError = false){
    $("#estado").textContent = texto;
    $("#estado").classList.toggle("error", esError);
}

function crearCelda(texto) {
    const celda = document.createElement("td");
    celda.textContent = texto;
    return celda;
}

function pintarEstadisticas(filas) {
    const cuerpo = $("#cuerpo-estadisticas");
    cuerpo.replaceChildren();
    for (const fila of filas) {
        const tr = document.createElement("tr");
        tr.append(
            crearCelda(fila.genero),
            crearCelda(fila.total),
            crearCelda(Number(fila.notaMedia).toFixed(2))
        );
        cuerpo.append(tr);
    }
}

async function cargar(minimo) {
    mostrarMensaje("...Cargando");
    try {
        const filas = await estadisticas(minimo);
        pintarEstadisticas(filas);
        mostrarMensaje(filas.length ? `${filas.length} géneros` : "No hay géneros que cumplan el mínimo indicado");
    } catch (error) {
        pintarEstadisticas([]);
        mostrarMensaje(error.message || "No se pudo conectar con el servidor", true);
    }
}

$("#form-estadisticas").addEventListener("submit", evento => {
    evento.preventDefault();
    cargar(new FormData(evento.target).get("minimo"));
});

cargar("");
