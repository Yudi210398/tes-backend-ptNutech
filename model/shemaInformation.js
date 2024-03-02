import mongoose from "mongoose";

const Schema = mongoose.Schema;

const InformationSchema = new Schema({
  banner: [
    {
      banner_name: { type: String },
      banner_image: { type: String },
      description: { type: String },
    },
  ],
  service: [
    {
      service_code: { type: String },
      service_name: { type: String },
      service_icon: { type: String },
      service_tariff: { type: Number },
    },
  ],
});

export default mongoose.model("Informations", InformationSchema);
