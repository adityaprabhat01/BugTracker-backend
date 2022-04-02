const { Bug } = require("../models/Bug");
const { Comment } = require("../models/Comment");
const { isObjectEmpty } = require("../utils");
const mongoose = require("mongoose");

const postComment = async (req, res) => {
  const { user, body, bug_id, project_id, activity } = req.body;
  const reactions = [
    { name: "like", count: 0, _id: mongoose.Types.ObjectId() },
    { name: "laugh", count: 0, _id: mongoose.Types.ObjectId() },
    { name: "angry", count: 0, _id: mongoose.Types.ObjectId() }
  ]
  try {
    const bug = await Bug.findOne({ _id: bug_id });
    // if (bug.user.user_id.toString() !== user.user_id) {
    //   return res.json({
    //     message: "User not authorized to close the bug",
    //   });
    // }
    const newComment = new Comment({
      user,
      body,
      bug_id,
      project_id,
      activity,
      reactions
    })
    const comment = await newComment.save();

    
    const { comments } = bug;
    comments.push(comment.id)
    await bug.save();

    res.json(comment);
  } catch (err) {
    res.json({
      error: "Something went wrong"
    })
  }
}

const updateComment = async (req, res) => {
  const { comment_id, body } = req.body;
  try {
    const comment = await Comment.findOne({ _id: comment_id });
    if(isObjectEmpty(comment)) {
      return res.json({
        message: "Comment does not exist"
      })
    }
    comment.body = body;
    const updatedComment = await comment.save();
    res.json(updatedComment)
  } catch (err) {
    res.json({
      error: "Something went wrong"
    })
  }
}

const deleteComment = async (req, res) => {
  const { comment_id, user_id, bug_id } = req.body;
  
  try {
    // Delete from the Comment model
    const comment = await Comment.findOne({ _id: comment_id });
    if(comment.user.user_id.toString() !== user_id) {
      return res.json({
        message: "User is not authorized to delete the comment"
      })
    }
    const deletedComment = await Comment.findOneAndDelete({ _id: comment_id });
    
    // update the Bug model
    const bug = await Bug.findOne({ _id: bug_id });
    if(isObjectEmpty(bug)) {
      return res.json({
        message: "Bug does not exist"
      })
    }
    const { comments } = bug;
    const filtered_comments = comments.filter(comment => comment.toString() !== comment_id);
    bug.comments = filtered_comments;
    bug.save();

    res.json(deletedComment);
  } catch (err) {
    res.json({
      error: "Something went wrong"
    })
  }
}

const reactToComment = async (req, res) => {
  const { index, comment_id } = req.body;
  try {
    const comment = await Comment.findOne({ _id: comment_id });
    comment.reactions[index].count = comment.reactions[index].count + 1;
    await comment.save();
    res.json({
      reaction: comment.reactions[index],
      comment_id,
      index
    })
  } catch (err) {
    res.json({
      error: "Something went wrong"
    })
  }
}

module.exports = {
  postComment,
  updateComment,
  deleteComment,
  reactToComment
}