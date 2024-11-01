import { Model, Schema, models, model } from "mongoose";

export type HotelsModelType = {
  _id: Schema.Types.ObjectId;
  name: String;
  address: String;
  city: String;
  photos: String[];
  rating: Number;
  description: String;
  reviewRating: Number;
  phone: String;
  createdAt: Date;
  updatedAt: Date;
};

const HotelSchema = new Schema<HotelsModelType>({
  name: { type: String, required: true },
  description: { type: String, required: false },
  city: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  photos: { type: [String], required: true },
  rating: { type: Number },
  reviewRating: { type: Number },
  createdAt: { type: Date, default: Date.now, required: true, immutable: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});

export const RoomModel: Model<HotelsModelType> =
  models["Hotels"] || model<HotelsModelType>("Hotels", HotelSchema);
