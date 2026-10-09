# Chat WebSocket

Aplicación web de chat uno a uno desarrollada con Node.js, WebSocket y SQLite. Permite que dos usuarios se conecten, intercambien mensajes en tiempo real y almacenen el registro de usuarios y mensajes en una base de datos.

## Tecnologías utilizadas

- Node.js: servidor de la aplicación.
- WebSocket (`ws`): comunicación en tiempo real.
- SQLite (`better-sqlite3`): almacenamiento de usuarios y mensajes.
- HTML, CSS y JavaScript: interfaz del chat.
- ngrok: acceso temporal desde otros dispositivos a través de Internet.

## Funcionalidades

- Registro de nombres de usuario.
- Chat privado entre dos usuarios.
- Mensajes enviados a la derecha y recibidos a la izquierda.
- Identificación del remitente en cada mensaje.
- Desplazamiento automático al último mensaje.
- Registro de usuarios y mensajes en SQLite.
- Acceso desde otros dispositivos mediante una URL de ngrok.

## Requisitos

- Node.js y npm.
- Una conexión a Internet si se utiliza ngrok.

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone URL_DEL_REPOSITORIO
   ```

2. Entrar en la carpeta:

   ```bash
   cd chat-websocket
   ```

3. Instalar las dependencias:

   ```bash
   npm install
   ```

## Ejecución

Iniciar el servidor:

```bash
node server.js
```

Abrir en el navegador:

```text
http://localhost:3000
```

Para acceder desde otros dispositivos a través de ngrok, iniciar en otra terminal:

```bash
ngrok http 3000
```

Después, abrir en el otro dispositivo la URL HTTPS que proporciona ngrok.

## Base de datos

El archivo `database.js` crea las tablas necesarias para guardar los usuarios y mensajes. La base de datos `chat.db` se genera localmente al ejecutar la aplicación.

## Autor

Bleyder Yesid Martinez Pacheco
