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
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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