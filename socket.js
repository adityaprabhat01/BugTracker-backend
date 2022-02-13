const { Notification } = require("./models/Notification");
const { User } = require("./models/User");
const { client } = require("./redis");
const { userid_to_socket } = require("./redis");

async function add_to_project(payload, socket) {
  const { username } = payload;
  const user = await User.findOne({ username });
  const notification = await Notification.findOne({ user_id: user._id });

  const socket_id = await userid_to_socket.get(user.id);
  const checkOnline = await client.get(socket_id);
  
  console.log(checkOnline);
  if (checkOnline !== null) {
    console.log(checkOnline);
    const obj = JSON.parse(checkOnline);
    socket.broadcast.to(socket_id).emit("added-to-project-success", {
      message: `${payload.username} add you to the project ${payload.title}`,
    });
  } else {
    const { notifications } = notification;
    notifications.push({
      socket_id: socket.id,
      payload,
      message: `${payload.username} add you to the project ${payload.title}`,
    });
    await notification.save();
  }
}

async function onCloseTab(payload, socket) {
  const user = await client.get(socket.id);
  const obj = JSON.parse(user);
  const { user_id } = obj;

  const y = await userid_to_socket.get(user_id);
  console.log(y);

  await userid_to_socket.del(user_id);
  await client.del(socket.id);

  const x = await userid_to_socket.get(user_id);
  console.log(x);
  console.log("Disconnect");
}

async function onLogin(payload, socket) {
  const obj = JSON.stringify({
    username: payload.username,
    user_id: payload.user_id,
    name: payload.name,
  });
  await client.set(socket.id, obj);
  await userid_to_socket.set(payload.user_id, socket.id);

  socket.emit("success", {
    message: true
  })

  const x = await client.get(socket.id);
  console.log(x);
}

async function checkOnlineStatus(payload, socket) {
  const id = socket.id;
  const checkOnline = await client.get(id);
  console.log(checkOnline, id)
  if (checkOnline !== null) {
    socket.broadcast.to(id).emit("online-status", {
      online: true
    });
  } else {
    console.log("false",id)
    socket.emit("online-status", {
      online: false
    });
  }
}

function socketCallback(socket) {
  console.log("Socket activated");

  socket.on("added-to-project", (payload) => {
    add_to_project(payload, socket);
  });

  socket.on("disconnect", (payload) => {
    onCloseTab(payload, socket);
  });

  socket.on("login", (payload) => {
    onLogin(payload, socket);
  });

  socket.on("check-online-status", payload => {
    checkOnlineStatus(payload, socket);
  })
}

module.exports = {
  socketCallback,
};
