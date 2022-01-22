const mongoose = require('mongoose')
const { projectDetailSchema } = require('./ProjectDetail')

const userCacheSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  projects: [{ type: projectDetailSchema }]
})

const UserCache = mongoose.model('UserCache', userCacheSchema);

module.exports = {
  UserCache
}