const mongoose = require('mongoose')

const userDetailSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  profileImageUrl: {
    type: String,
  }
})

const UserDetail = mongoose.model('UserDetail', userDetailSchema);

module.exports = {
  UserDetail,
  userDetailSchema
}