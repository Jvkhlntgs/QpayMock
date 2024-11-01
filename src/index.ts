import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
const QRCode = require("qrcode");
// get/orderId { paid: false } => order findbyandupdate paid {true } => success
const urlToQR = async (url: string) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(url);

    return qrCodeDataUrl;
  } catch (err) {
    console.error("Error generating QR code:", err);
  }
};

app.post("/generate-qr", async (req: Request, res: Response) => {
  const { url } = req.body;
  const qr = await urlToQR(url);

  res.status(200).send(qr);
});

app.listen(8000, () => {
  console.log("http://localhost:8000");
});
