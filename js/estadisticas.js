import { estadisticas } from "./api.js";

const $ = selector => document.querySelector(selector);

function mostrarMensaje(texto, esError = false) {
    $("#estado").textContent = texto;
    $("#estado").classList.toggle("error", esError);
}

function crearCelda(texto, clase) {
    const td = document.createElement("td");
    td.textContent = texto;
    if (clase) td.className = clase;
    return td;
}

function pintarTabla(filas) {
    const cuerpo = $("#cuerpo-tabla");
    cuerpo.replaceChildren();
    for (const fila of filas) {
        const tr = document.createElement("tr");
        tr.append(
            crearCelda(fila.genero),
            crearCelda(fila.total, "num"),
            crearCelda(Number(fila.notaMedia).toFixed(2), "num")
        );
        cuerpo.append(tr);
    }
    $("#tabla").hidden = filas.length === 0;
}

async function cargarEstadisticas(parametros = {}) {
    mostrarMensaje("...Cargando");
    $("#tabla").hidden = true;
    try {
        const filas = await estadisticas(parametros);
        pintarTabla(filas);
        mostrarMensaje(filas.length ? `${filas.length} géneros` : "No hay géneros que cumplan el filtro.");
    } catch (error) {
        const detalles = Array.isArray(error.detalles) && error.detalles.length
            ? error.detalles.join(". ")
            : error.message;
        mostrarMensaje(detalles, true);
    }
}

$("#form-estadisticas").addEventListener("submit", evento => {
    evento.preventDefault();
    const valores = Object.fromEntries(new FormData(evento.target));
    const parametros = Object.fromEntries(
        Object.entries(valores).filter(([, valor]) => valor !== "")
    );
    cargarEstadisticas(parametros);
});

cargarEstadisticas();
