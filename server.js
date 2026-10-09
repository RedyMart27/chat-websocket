const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");
const db = require("./database");
const servidorHttp = http.createServer();
const servidor = new WebSocket.Server({noServer: true});
let usuario1 = null;
let usuario2 = null;

//detectar conexiones
servidor.on("connection", (socket) => {
    console.log("Un ususario se ha conectado");

    if (usuario1 === null) {
        usuario1 = socket;
        console.log("Usuario 1 conectado");
    } else if (usuario2 === null) {
        usuario2 = socket;
        console.log("Usuario 2 conectado");
    }

    //recibi conexiones
    socket.on("message", (mensaje) => {
        const datos = JSON.parse(mensaje.toString());

        if (datos.tipo === "usuario") {
            socket.nombre = datos.nombre;
            console.log("Nombre registrado:", socket.nombre);

            //guardar usuario en la base de datos
            const usuario = db.prepare(`
                INSERT INTO usuarios (nombre)
                VALUES (?)
            `).run(socket.nombre);

        socket.idUsuario = usuario.lastInsertRowid;

            if (usuario1 !== null && usuario2 !== null) {
                usuario1.send(JSON.stringify({
                    tipo: "contacto",
                    nombre: usuario2.nombre
                }));

                usuario2.send(JSON.stringify({
                    tipo: "contacto",
                    nombre: usuario1.nombre
                }));
            }
        }

        if (datos.tipo === "mensaje") {

            //guardar mensaje en la base de datos
            let receptorId = null;

            if (socket === usuario1 && usuario2 !== null) {
                receptorId = usuario2.idUsuario;
            }

            if (socket === usuario2 && usuario1 !== null) {
                receptorId = usuario1.idUsuario;
            }

            db.prepare(`
                INSERT INTO mensajes (usuario_id, receptor_id, mensaje)
                VALUES (?, ?, ?)
            `).run(
                socket.idUsuario,
                receptorId,
                datos.mensaje
            );

            const mensajeChat = JSON.stringify({
                tipo: "mensaje",
                nombre: socket.nombre,
                mensaje: datos.mensaje
            });

            if (socket === usuario1 && usuario2 !== null) {
                usuario2.send(mensajeChat);
            }

            if (socket === usuario2 && usuario1 !== null) {
                usuario1.send(mensajeChat);
            }
        }



    });

});

//conexion para http
servidorHttp.on("upgrade", (request, socket, head) => {
    servidor.handleUpgrade(request, socket, head, (ws) => {
        servidor.emit("connection", ws, request);
    });
});

//servir archivos
servidorHttp.on("request", (req, res) => {

    if (req.url === "/style.css") {
        const archivo = fs.readFileSync("./public/style.css");

        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(archivo);
        return;
    }


    if (req.url === "/app.js") {
        const archivo = fs.readFileSync("./public/app.js");

        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(archivo);
        return;
    }

    const pagina = fs.readFileSync("./public/index.html");

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(pagina);
});

servidorHttp.listen(3000, "0.0.0.0", () => {
    console.log("Servidor Websocket iniciando en el puerto 3000");
});
//servidorHttp.listen(3000, () => {
//    console.log("Servidor Websocket iniciando en el puerto 3000");
//});