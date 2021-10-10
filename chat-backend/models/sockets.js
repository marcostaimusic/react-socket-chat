const {
  connectedUser,
  disconnectedUser,
  getUsers,
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

      this.io.emit("connectedUsersList", await getUsers());

      // console.log(uid, "client connected");

      socket.on("disconnect", async () => {
        await disconnectedUser(uid);
        console.log("client disconnected", isValid, uid);
        this.io.emit("connectedUsersList", await getUsers());
      });
    });
  }
}

module.exports = Sockets;

// console.log("client connected", isValid, uid);
// socket.on("messageToServer", (data) => {
//   console.log(data);
//   //send message only to the same socket
//   // socket.emit("messageFromServer", data);
//   //send message to all sockets connected to io instance
//   this.io.emit("messageFromServer", data);
// });

// socket.on("typing", (data) => {
//   this.io.emit("typingFromServer", data);
// });
