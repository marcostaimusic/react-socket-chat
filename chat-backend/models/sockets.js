const { createRoom } = require("../controllers/room.controllers");
const {
  connectedUser,
  disconnectedUser,
  getUsers,
  recordMessage,
  existingRooms,
} = require("../controllers/socket.controller");
const { verifyJWT } = require("../helpers/jwt");

class Sockets {
  constructor(io) {
    this.io = io;
    this.socketEvents();
  }

  socketEvents() {
    //the socket is the client connecting to the server
    this.io.on("connection", async (socket) => {
      const [isValid, uid] = verifyJWT(socket.handshake.query["x-token"]);

      if (!isValid) {
        console.log("Unknown socket");
        socket.disconnect();
      }

      await connectedUser(uid);
      const rooms = await existingRooms();

      socket.join(uid); // se commento questa linea non si scambiano più i messaggi

      this.io.emit("connectedUsersList", await getUsers());
      this.io.emit("existentRooms", rooms);

      socket.on("personalMessage", async (payload) => {
        const message = await recordMessage(payload);
        this.io.to(payload.to).emit("personalMessage", message);
        this.io.to(payload.from).emit("personalMessage", message);
      });

      socket.on("roomMessage", async (payload) => {
        const message = await recordMessage(payload);

        const user = await connectedUser(payload.from);
        // console.log(user.name);

        socket.broadcast.to(payload.to).emit("roomMessage", { message, user });
        socket.broadcast
          .to(payload.from)
          .emit("roomMessage", { message, user });
        this.io.emit("roomMessage", { message, user });
        this.io.to(payload.to).emit("roomMessage", { message, user });
      });

      socket.on("disconnect", async () => {
        await disconnectedUser(uid);

        this.io.emit("connectedUsersList", await getUsers());
        this.io.emit("existentRooms", await existingRooms());
      });

      socket.on("createRoom", async (payload) => {
        const room = await createRoom(payload);
        this.io.emit("roomCreated", room);
      });
    });
  }
}

module.exports = Sockets;
