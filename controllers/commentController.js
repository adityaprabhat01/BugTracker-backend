const { Bug } = require("../models/Bug");
const { Comment } = require("../models/Comment");
const { isObjectEmpty } = require("../utils");

const postComment = async (req, res) => {
  const { user, body, bug_id, project_id } = req.body;
  try {
    const newComment = new Comment({
      user,
      body,
      bug_id,
      project_id
    })
    const comment = await newComment.save();

    const bug = await Bug.findOne({ _id: bug_id });
    const { comments } = bug;
    comments.push(comment._id)
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

module.exports = {
  postComment,
  updateComment,
  deleteComment
}