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
  details: {
    type: String,
  },
  members: [{ type: userDetailSchema }],
  techStack: [
    {
      name: {
        type: String,
      },
    },
  ],
  projectImageUrl: {
    type: String,
  },
  comments: [
    {
      type: commentSchema,
    },
  ],
});

const Project = mongoose.model("Project", projectSchema);

module.exports = {
  Project,
};
