import mongoose, { mongo } from "mongoose";

const adoptionSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
    },
    reason: { type: String, required: false },
  },
  {
    timestamps: true,
    collection: "adoptions",
  }
);

const AdoptionModel = mongoose.model("Adoption", adoptionSchema);

export default AdoptionModel;
