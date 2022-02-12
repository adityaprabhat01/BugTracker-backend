const { Notification } = require("./models/Notification");
const { User } = require("./models/User");

async function add_to_project(payload, socket) {
  console.log(socket.id, payload);
  const { username } = payload;
  const user = await User.findOne({ username })
  const notification = await Notification.findOne({ user_id: user._id })
  const { notifications } = notification;
  notifications.push({
    socket_id: socket.id,
    payload,
    message: `${payload.username} add you to the project ${payload.title}`
  })

  await notification.save();

  socket.emit("added-to-project-success", {
    message: "Added",
  });
}

function socketCallback(socket) {
  console.log("Socket activated");
  socket.on("added-to-project", (payload) => {
    add_to_project(payload, socket);
  });
}

module.exports = {
  socketCallback,
};
