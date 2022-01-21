const mongoose = require("mongoose");
const { userDetailSchema } = require("./UserDetail");

const commentSchema = mongoose.Schema({
  user: {
    type: userDetailSchema,
  },
  comment: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = {
  Comment,
  commentSchema,
};
