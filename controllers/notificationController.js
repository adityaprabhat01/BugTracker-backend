const { Notification } = require("../models/Notification");

const getNotifications = async (req, res) => {
  const { user_id } = req.params;
  try {
    const notifications = await Notification.findOne({ user_id });
    if (!notifications) {
      res.json({
        message: "User does not exist",
      });
    }
    res.send(notifications);
  } catch (err) {
    res.json({
      error: "Something went wrong",
    });
  }
};

const markAsRead = async (req, res) => {
  const { notification_id, user_id } = req.body;
  try {
    const notification = await Notification.findOne({ user_id });
    const temp = notification.notifications;
    for (let i = 0; i < temp.length; i++) {
      if (temp[i]._id.toString() === notification_id) {
        temp[i].seen = true;
        break;
      }
    }
    notification.notifications = temp;
    notification.markModified("notifications")
    notification.count = notification.count - 1;
    await notification.save();
    res.send({
      read: true,
      notification_id
    });
  } catch (err) {
    res.json({
      error: "Something went wrong",
    });
  }
};

const getNotificationCount = async (req, res) => {
  const { user_id } = req.params;
  try {
    const notifications = await Notification.findOne({ user_id });
    if (!notifications) {
      res.json({
        message: "User does not exist",
      });
    }
    const { count } = notifications;
    res.json({
      count
    });
  } catch (err) {
    res.json({
      error: "Something went wrong",
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  getNotificationCount
};
