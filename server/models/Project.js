const { model, Schema } = require("mongoose");

// Project Model

const projectSchema = new Schema({
  project_name: String,
  project_description: String,
  project_time: String,
  project_status: String,
  email: String,
  resources: [
    {
      location: String,
      country: String,
      state: String,
      coordinates: String,
      image_1_description: String,
      image_2_description: String,
      image_1_source: String,
      image_2_source: String,
      image_1_date: String,
      image_2_date: String,
      resource_time: String,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = model("Project", projectSchema);
