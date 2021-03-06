const mongoose = require("mongoose");
const { commentSchema } = require("./Comment");
const { userDetailSchema } = require("./UserDetail");

const projectSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: userDetailSchema,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  body: {
    type: String,
  },
  members: [{ type: userDetailSchema }],
  techStack: [{ name: String }],
  projectImageUrl: {
    type: String,
  },
  bugs: [{ type: mongoose.Types.ObjectId, ref: "Bug" }],
  mentionIdCurrent: Number,
});

const Project = mongoose.model("Project", projectSchema);

module.exports = {
  Project,
};
