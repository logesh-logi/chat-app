const chatform = document.getElementById("chat-form");
const roomname = document.getElementById("room-name");
const userList = document.getElementById("users");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const outputmsg = (msgg) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${msgg.username} <span>${msgg.time}(UTC)</span></p> <p class="text">${msgg.message}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
};

const outputRoomName = (room) => {
  roomname.innerText = room;
};

const outputRoomUser = (user) => {
  userList.innerHTML = `
  ${user.map((user) => `<li>${user.username}</li>`).join("")}
  `;
};

const socket = io();

socket.emit("userjoin", { username, room });

socket.on("msg", (msgg) => {
  outputmsg(msgg);
  const chatmsg = document.querySelector(".chat-messages");
  chatmsg.scrollTop = chatmsg.scrollHeight;
});

socket.on("roomUser", ({ room, users }) => {
  outputRoomName(room);
  outputRoomUser(users);
});

chatform.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit("chatmsg", msg);
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});
