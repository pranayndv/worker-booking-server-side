import mongoose from "mongoose";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const serviceProviderSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String, required: true },
    lastName: { type: String, required: true },
    DOB: { type: Date, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    tal: { type: String, required: true },
    pincode: { type: Number, required: true },
    phoneNumber: { type: Number, unique: true, required: true },
    // phoneVerification: { type: Boolean, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    selectService: {
      type: [String],
      // required: true,
    },
    selectServiceCategory: {
      type: [String],
      // required: true,
    },
    uploadIdProof: {
      type: String,
      // required: true,
    },
    uploadResume: {
      type: String,
      // required: true,
    },
    avatar: {
      type: String,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

serviceProviderSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }
  next();
});

serviceProviderSchema.methods.comparePassword = async function (password) {
  const result = await bcrypt.compareSync(password, this.password);
  return result;
};

const serviceModel = mongoose.model(
  "serviceregistrations",
  serviceProviderSchema
);
export default serviceModel;
