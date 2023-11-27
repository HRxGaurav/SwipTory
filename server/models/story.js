import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    slides: [
      {
        heading: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        imageUrl: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
      },
    ],
    likes: [
      {
        type: String,
      },
    ],
    bookmarks: [
      {
        type: String,
      },
    ],

    addedBy: {
      type: String,
    },
  },
  { timestamps: true }
);

const Story = mongoose.model("Story", storySchema);

export default Story;
