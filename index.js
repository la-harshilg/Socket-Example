const express = require("express");
const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

let connectedClient = 0;

// var nsp = io.of("/my-namespace");

io.on("connection", (socket) => {
  connectedClient++;
  console.log("Connected.");

  io.sockets.emit("broadcast", {
    desc: `${connectedClient} clients are connected.`,
  });

  setTimeout(() => {
    socket.send("Hello Message!!");
  }, 5000);

  //   socket.on("play", () => {
  //     console.log("Playing Game......");
  //   });

  // New Client will get this message
  socket.emit("newclient", {
    desc: "Hey, You are Welcome!",
  });

  // All existing client get this message after new client is connected
  socket.broadcast.emit("newclient", {
    desc: `Hey New, ${connectedClient} client(s) are connected.`,
  });

  socket.on("disconnect", () => {
    connectedClient--;
    console.log("Disconnected.");
    io.sockets.emit("broadcast", {
      desc: `${connectedClient} clients are connected.`,
    });
  });
});

server.listen(8080, () => {
  console.log("App Listening on PORT 8080.........");
});
