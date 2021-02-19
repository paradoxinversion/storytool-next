import mongoose, { Schema } from "mongoose";

const SceneSchema = new Schema({
  name: { type: String, default: "" },
  text: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  part: { type: Schema.Types.ObjectId, ref: "Project", required: true },
});

let Scene;

try {
  Scene = mongoose.model("Scene");
} catch {
  Scene = mongoose.model("Scene", SceneSchema);
}
export default Scene;
