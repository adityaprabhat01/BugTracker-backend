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
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  bugs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bug' }]
})

const UserCache = mongoose.model('UserCache', userCacheSchema);

module.exports = {
  UserCache
}