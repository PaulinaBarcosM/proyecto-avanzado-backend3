import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  pets: { type: [mongoose.Schema.Types.ObjectId], ref: "Pet", default: [] },
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
