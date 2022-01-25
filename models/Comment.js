const mongoose = require("mongoose");
const { userDetailSchema } = require("./UserDetail");

const commentSchema = mongoose.Schema({
  user: {
    type: userDetailSchema,
  },
  body: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  bug_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bug'
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = {
  commentSchema,
  Comment
};
