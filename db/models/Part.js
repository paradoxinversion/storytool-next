import mongoose, { Schema } from "mongoose";
// part, such as a chapter or major section
const PartSchema = new Schema({
  name: { type: String, default: "Unnamed Part" },

  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

let Part;

try {
  Part = mongoose.model("Part");
} catch {
  Part = mongoose.model("Part", PartSchema);
}
export default Part;
