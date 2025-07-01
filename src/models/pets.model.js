import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specie: { type: String, required: true },
    breed: { type: String, required: true },
    adopted: { type: Boolean, default: false },
    color: { type: String },
    age: {
      years: { type: Number, required: true },
      months: { type: Number, default: 0 },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    image: {
      type: String,
    },
  },
  { collection: "pets" }
);

const PetModel = mongoose.model("Pet", petSchema);
export default PetModel;
