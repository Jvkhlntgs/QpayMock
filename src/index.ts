import express, { Request, Response } from "express";
import cors from "cors";
import axios from "axios";

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

const callGQLQr = async (
  name: string,
  bookingId: string,
  eventId: string,
  venues: Record<string, string>
) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(
      `https://qpaymock.onrender.com/interAB?serviceName=${name}&bookingId=${bookingId}&eventId=${eventId}&venues=${JSON.stringify(
        venues
      )}`
    );

    return qrCodeDataUrl;
  } catch (err) {
    console.error("Error generating QR code:", err);
  }
};

app.post("/generate-qr", async (req: Request, res: Response) => {
  const { url, serviceName, venues, bookingId, eventId } = req.body;
  if (!serviceName) {
    const qr = await urlToQR(url);
    res.status(200).send(qr);
    return;
  }

  const qr = await callGQLQr(serviceName, bookingId, eventId, venues);
  res.status(200).send(qr);
});

app.get("/interAB", async (req: Request, res: Response) => {
  const { serviceName, bookingId, eventId, venues } = req.params;
  const variables = { _id: bookingId, eventId, venues: JSON.parse(venues) };

  const BACKENDS: any = {
    hotel: {
      query: `
      query GetBooks {
        books {
          title
          author
        }
      }
    `,
      url: "backendUrl",
    },

    ticket: {
      query: `
      mutation UpdateEventQuantityBooking($input: UpdateEventQuantityInput!) {
        updateEventQuantityBooking(input: $input) {
          _id
        }
      }
    `,
      url: "https://concert-ticket-service-prod.vercel.app/api/graphql",
    },
  };

  await axios.post(
    BACKENDS[serviceName].url,
    { query: BACKENDS["hotel"].query, variables },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  res.status(200).send("Successfully paid ;");
});

app.listen(8000, () => {
  console.log("http://localhost:8000");
});
