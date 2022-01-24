const mongoose = require('mongoose');

const userCacheSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String
  },
  username: {
    type: String
  },
  projects: [{ project_id: mongoose.Schema.Types.ObjectId }],
  bugs: [{ bug_id: mongoose.Schema.Types.ObjectId }]
})

const UserCache = mongoose.model('UserCache', userCacheSchema);

module.exports = {
  UserCache
}