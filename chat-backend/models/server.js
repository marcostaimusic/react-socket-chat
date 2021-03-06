require("dotenv").config();
const express = require("express");
const http = require("http");
//socket server config
const socketio = require("socket.io");
const path = require("path");
const cors = require("cors");
const Sockets = require("./sockets");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    //connecting to MongoDB
    dbConnection();

    //http server
    this.server = http.createServer(this.app);
    //socket config
    this.io = socketio(this.server, {
      cors: {
        origin: "*",
      },
    });
  }

  middleware() {
    this.app.use(express.static(path.resolve(__dirname, "../public")));
    this.app.use(cors());
    this.app.use(express.json());

    this.app.use("/api/login", require("../router/authRouter"));
    this.app.use("/api/messages", require("../router/chatRouter"));
    this.app.use("/api/room", require("../router/roomRouter"));
  }

  configSockets() {
    new Sockets(this.io);
  }

  execute() {
    //initialize this.middleware
    this.middleware();

    //initialize sockets
    this.configSockets();
    //initialize this.server
    this.server.listen(this.port, () => {
      console.log(`$Server listening on port ${this.port}`);
    });
  }
}

module.exports = Server;
