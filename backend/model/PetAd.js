//pet ad schema
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PetAdSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    petCategory: {
      type: String,
      ref: "PetCategory",
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

    price: {
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

    price: {
      type: Number,
      required: true,
    },

  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);


const PetAd = mongoose.model("PetAd", PetAdSchema);

export default PetAd;
