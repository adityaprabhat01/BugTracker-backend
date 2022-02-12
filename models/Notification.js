const mongoose = require("mongoose");
const { userDetailSchema } = require("./UserDetail");

const notificationSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  username: String,
  name: String,
  notifications: Array
})

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = {
  Notification
}