const mongoose = require('mongoose')
const { commentSchema } = require('./Comment')
const { userDetailSchema } = require('./UserDetail')

const bugSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  user: {
    type: userDetailSchema
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
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
  labels: [{
    type: String
  }],
  isOpen: {
    type: Boolean
  },
  members: [{ type: userDetailSchema }]
})

const Bug = mongoose.model('Bug', bugSchema);

module.exports = {
  Bug
}