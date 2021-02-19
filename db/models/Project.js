import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

let Project;

try {
  Project = mongoose.model("Project");
} catch {
  Project = mongoose.model("Project", ProjectSchema);
}
export default Project;
