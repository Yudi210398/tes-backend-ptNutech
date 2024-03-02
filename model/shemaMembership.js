import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MembershipSchema = new Schema({
  email: String,
  first_name: String,
  last_name: String,
  password: String,
  profile_image: {
    type: String,
    default:
      "https://res.cloudinary.com/dymv3cmhq/image/upload/v1674914217/cld-sample-5.jpg",
  },

  balance: { type: Number, default: 0 },
});

export default mongoose.model("Membership", MembershipSchema);
