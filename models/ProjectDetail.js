const mongoose = require('mongoose')

const projectDetailSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  project_id: {
    type: mongoose.Types.ObjectId
  }
})

const ProjectDetail = mongoose.model('ProjectDetail', projectDetailSchema);

module.exports = {
  ProjectDetail,
  projectDetailSchema
}