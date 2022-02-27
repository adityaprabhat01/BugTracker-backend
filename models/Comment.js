const mongoose = require("mongoose");
const { userDetailSchema } = require("./UserDetail");

const commentSchema = mongoose.Schema({
  user: {
    type: userDetailSchema,
  },
  activity: {
    isActivity: Boolean,
    value: String
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
  },
  reactions: [{
    name: String,
    count: Number,
  }]
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = {
  commentSchema,
  Comment
};
