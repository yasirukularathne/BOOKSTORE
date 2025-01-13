import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publishYear: {
      type: Number,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    driveLink: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^https:\/\/drive\.google\.com\/drive\/folders\/[a-zA-Z0-9_-]+$/.test(v);
        },
        message: props => `${props.value} is not a valid Google Drive folder link!`
      }
    }
  },
  {
    timestamps: true,
  }
);

export const Book = mongoose.model("Book", bookSchema);