const mongoose = require('mongoose')
const { commentSchema } = require('./Comment')
const { projectDetailSchema } = require('./ProjectDetail')
const { userDetailSchema } = require('./UserDetail')

const bugSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  user: {
    type: userDetailSchema
  },
  body: {
    type: String,
    required: true
  },
  date_opened: {
    type: Date,
    default: Date.now
  },
  isOpen: {
    type: Boolean
  },
  comments: [{
    type: commentSchema
  }],
  project: {
    type: projectDetailSchema
  }
})

const Bug = mongoose.model('Bug', bugSchema);

module.exports = {
  Bug
}