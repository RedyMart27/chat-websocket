//const socket = new WebSocket("ws://" + window.location.host);
const protocolo = window.location.protocol === "https:" ? "wss://" : "ws://";

const socket = new WebSocket(protocolo + window.location.host);

let miNombre = "";

socket.onopen = () => {

    console.log("Conectado al servidor");

};

socket.onmessage = (evento) => {

    const datos = JSON.parse(evento.data);

    if (datos.tipo === "contacto") {

        const contacto = document.getElementById("contacto");

        contacto.textContent = "👤 " + datos.nombre + " - En línea";
    }

    if (datos.tipo === "mensaje") {

        mostrarMensaje(datos.nombre, datos.mensaje, false);
    }

};

//mostrar mensajes en el chat
function mostrarMensaje(nombre, texto, propio) {

    const mensajes = document.getElementById("mensajes");

    const nuevoMensaje = document.createElement("div");

    nuevoMensaje.classList.add("mensaje");

    if (propio) {
        nuevoMensaje.classList.add("propio");
    } else {
        nuevoMensaje.classList.add("otro");
    }

    nuevoMensaje.textContent = nombre + ": " + texto;

    mensajes.appendChild(nuevoMensaje);

    mensajes.scrollTop = mensajes.scrollHeight;
}

//comunicaion del navegador con elservidor

const mensaje = document.getElementById("mensaje");

const boton = document.getElementById("enviar");

const nombre = document.getElementById("nombre");
const botonEntrar = document.getElementById("entrar");

botonEntrar.addEventListener("click", () => {

    miNombre = nombre.value;

    socket.send(JSON.stringify({
        tipo: "usuario",
        nombre: nombre.value
    }));

    nombre.disabled = true;
    botonEntrar.disabled = true;

    const usuarioActual = document.getElementById("usuarioActual");
    usuarioActual.textContent = "👤 " + nombre.value + " - En línea";

});

boton.addEventListener("click", () => {

    if (mensaje.value.trim() === "") {
        return;
    }

    //mostrar mi mensaje a la derecha
    mostrarMensaje(miNombre, mensaje.value, true);

    socket.send(JSON.stringify({
        tipo: "mensaje",
        mensaje: mensaje.value
    }));

    mensaje.value = "";

});