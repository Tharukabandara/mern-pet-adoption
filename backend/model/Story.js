//story schema
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const StorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    
    location: {
      type: String,
      required: true,
    },
    
    phone: {
      type: Number,
      required: true,
    },
    
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    images: [
      {
        type: String,
        required: true,
      },
    ],

  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);


const Story = mongoose.model("Story", StorySchema);

export default Story;
