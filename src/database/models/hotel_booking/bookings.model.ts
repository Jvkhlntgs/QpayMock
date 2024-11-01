import { Model, Schema, models, model } from "mongoose";

export type BookingsModelType = {
  _id: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  hotelId: Schema.Types.ObjectId;
  roomId: Schema.Types.ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
};

enum Status {
  Pending = "pending",
  Canceled = "canceled",
  Paid = "paid",
}

const BookingSchema = new Schema<BookingsModelType>({
  userId: { type: Schema.Types.ObjectId, required: false, ref: "Users" },
  hotelId: { type: Schema.Types.ObjectId, required: false, ref: "Hotels" },
  roomId: { type: Schema.Types.ObjectId, required: false, ref: "Rooms" },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  status: { type: String },
  createdAt: { type: Date, default: Date.now, required: true, immutable: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});

export const BookingModel: Model<BookingsModelType> =
  models["Bookings"] || model<BookingsModelType>("Bookings", BookingSchema);
