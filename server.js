const express = require("express");

const app = express();

const hbs = require("hbs");
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);

const { ExpressPeerServer } = require("peer");

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.set("view engine", "hbs");
app.use(express.static("public"));

app.use("/peerjs", peerServer);

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("home", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    // console.log(roomId);
    console.log("hello");
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);

    socket.on('message', (message) => {
      io.to(roomId).emit('create-message',message);
    })
  });
});

const port = process.env.PORT || 3030;

server.listen(port, () => {
  console.log("Server running");
});
