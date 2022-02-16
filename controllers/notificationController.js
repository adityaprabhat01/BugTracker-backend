const { Notification } = require("../models/Notification")

const getNotifications = async (req, res) => {
  const { user_id } = req.params;
  try {
    const notifications = await Notification.findOne({ user_id });
    if(!notifications) {
      res.json({
        message: "User does not exist"
      })
    }
    res.send(notifications)

  } catch (err) {
    res.json({
      error: "Something went wrong"
    })
  }
  
}

module.exports = {
  getNotifications
}