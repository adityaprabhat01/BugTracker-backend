const mongoose = require('mongoose')

const projectDetailSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  project_id: {
    type: mongoose.Types.ObjectId
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  details: {
    type: String,
  },
})

const ProjectDetail = mongoose.model('ProjectDetail', projectDetailSchema);

module.exports = {
  ProjectDetail,
  projectDetailSchema
}