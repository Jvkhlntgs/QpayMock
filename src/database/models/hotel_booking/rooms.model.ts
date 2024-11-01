import { Model, Schema, models, model } from "mongoose";

export type RoomsModelType = {
  _id: Schema.Types.ObjectId;
  hotelId: Schema.Types.ObjectId;
  roomNumber: Number;
  price: Number;
  photos: String[];
  roomType: RoomType;
  description: String;
  createdAt: Date;
  updatedAt: Date;
};

enum RoomType {
  ONE = "one",
  TWO = "two",
  THREE = "three",
  KING = "king",
}

const RoomSchema = new Schema<RoomsModelType>({
  hotelId: { type: Schema.Types.ObjectId, required: false, ref: "Hotels" },
  roomNumber: { type: Number, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
  photos: { type: [String], required: true },
  roomType: { type: String },
  createdAt: { type: Date, default: Date.now, required: true, immutable: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});

export const RoomModel: Model<RoomsModelType> =
  models["Rooms"] || model<RoomsModelType>("Rooms", RoomSchema);
