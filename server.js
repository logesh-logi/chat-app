const http = require("http");
const path = require("path");

const express = require("express");
const socketio = require("socket.io");

const formatmsg = require("./utils/messsage");
const {
  userjoin,
  getCurrentUser,
  userLeave,
  getRoomUser,
} = require("./utils/user");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botname = "chatbot";

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("userjoin", ({ username, room }) => {
    const user = userjoin(socket.id, username, room);
    socket.join(user.room);

    //welcome msg to user
    // socket.emit("msg", formatmsg(botname, "welcome to chatchord"));

    //broadcasting user joined room
    socket.broadcast
      .to(user.room)
      .emit("msg", formatmsg(botname, `${user.username} has joined the chat `));

    //send user amd room info
    io.to(user.room).emit("roomUser", {
      room: user.room,
      users: getRoomUser(user.room),
    });
  });

  //chat messages
  socket.on("chatmsg", (ms) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("msg", formatmsg(user.username, ms));
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    // console.log(socket.id);

    // const user = getCurrentUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "msg",
        formatmsg(botname, `${user.username} has left the chat`)
      );
      //send room and user info
      io.to(user.room).emit("roomUser", {
        room: user.room,
        users: getRoomUser(user.room),
      });
    }
  });
});

server.listen(8000, () => {
  console.log("server running");
});
