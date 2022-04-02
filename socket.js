const mongoose = require("mongoose");
const { Notification } = require("./models/Notification");
const { User } = require("./models/User");
const { client } = require("./redis");
const { userid_to_socket } = require("./redis");
const async = require("async");

const queue = async.queue(async function (item, completed) {
  const {
    asyncEmit,
    asyncSave,
    member,
    auth,
    bug_id,
    socket,
    userid_to_socket,
    Notification,
    mentionId
  } = item;

  asyncSave(member, auth, Notification, bug_id, Notification, socket.id, mentionId);
  asyncEmit(member, socket, auth, bug_id, userid_to_socket, mentionId);
}, 1);

async function comment_on_bug(payload, socket) {
  const { members, auth, bug_id, mentionId } = payload;
  members.forEach(async (member, i) => {
    async function asyncEmit(member, socket, auth, bug_id, userid_to_socket, mentionId) {
      const socket_id = await userid_to_socket.get(member.user_id);       
      if(member.user_id !== auth.user_id) {
        socket.broadcast.to(socket_id).emit("comment-on-bug-success", {
          message: `${auth.username} commented on the bug ${mentionId}`,
        });
      }      
    }
    async function asyncSave(member, auth, Notification, bug_id, Notification, socket_id, mentionId) {
      const notification = await Notification.findOne({ user_id: member.user_id });
      const { notifications, count } = notification;
      notification.count = count + 1;
      notifications.push({
        _id: mongoose.Types.ObjectId(),
        socket_id,
        payload,
        message: `${auth.username} commented on the bug ${mentionId}`,
        seen: false,
      });      
      await notification.save();
    }

    const obj = {
      asyncEmit,
      asyncSave,
      member,
      auth,
      bug_id,
      socket,
      userid_to_socket,
      Notification,
      mentionId
    };

    queue.push(obj, (err, member) => {
      if (err) {
        console.log(err);
      } else {

      }
    });
  });
}

async function add_to_project(payload, socket) {
  const { username, title, auth } = payload;
  const user = await User.findOne({ username });
  const notification = await Notification.findOne({ user_id: user._id });

  const socket_id = await userid_to_socket.get(user.id);
  if (socket_id !== null || socket_id !== "") {
    socket.broadcast.to(socket_id).emit("added-to-project-success", {
      message: `${auth} added you to the project ${title}`,
    });
  }
  const { notifications, count } = notification;
  notification.count = count + 1;
  notifications.push({
    _id: mongoose.Types.ObjectId(),
    socket_id: socket.id,
    payload,
    message: `${auth} added you to the project ${title}`,
    seen: false,
  });
  await notification.save();
}

async function onCloseTab(payload, socket) {
  const user = await client.get(socket.id);
  const obj = JSON.parse(user);
  if (obj === null) return;
  const { user_id } = obj;
  await userid_to_socket.del(user_id);
  await client.del(socket.id);
  const x = await userid_to_socket.get(user_id);
}

async function onLogin(payload, socket) {
  const id = socket.id;
  const checkOnline = await client.get(id);
  if (checkOnline !== null) {
    socket.emit("online-status", {
      online: true,
    });
  } else {
    const obj = JSON.stringify({
      username: payload.username,
      user_id: payload.user_id,
      name: payload.name,
    });

    await client.set(socket.id, obj);
    await userid_to_socket.set(payload.user_id, socket.id);

    socket.emit("success", {
      message: true,
    });
  }
}

async function add_to_bug(payload, socket) {
  const { username, auth, title } = payload;
  const user = await User.findOne({ username });
  const notification = await Notification.findOne({ user_id: user._id });

  const socket_id = await userid_to_socket.get(user.id);

  if (socket_id !== null || socket_id !== "") {
    socket.broadcast.to(socket_id).emit("added-to-bug-success", {
      message: `${auth} assigned you the bug ${title}`,
    });
  }
  const { notifications, count } = notification;
  notification.count = count + 1;
  notifications.push({
    _id: mongoose.Types.ObjectId(),
    socket_id,
    payload,
    message: `${payload.username} assigned you the bug ${payload.title}`,
    seen: false,
  });
  await notification.save();
}

async function check_socket_in_redis(payload, socket) {
  const user = await client.get(socket.id);
  if (user) {
    socket.emit("check-redis-status", {
      message: true,
    });
  } else {
    socket.emit("check-redis-status", {
      message: false,
    });
  }
}

function socketCallback(socket) {
  console.log("Socket activated ", socket.id);

  socket.on("added-to-project", (payload) => {
    add_to_project(payload, socket);
  });

  socket.on("disconnect", (payload) => {
    onCloseTab(payload, socket);
  });

  socket.on("login", (payload) => {
    onLogin(payload, socket);
  });

  socket.on("added-to-bug", (payload) => {
    add_to_bug(payload, socket);
  });

  socket.on("comment-on-bug", (payload) => {
    comment_on_bug(payload, socket);
  });

  socket.on("check-redis", (payload) => {
    check_socket_in_redis(payload, socket);
  });
}

module.exports = {
  socketCallback,
};
