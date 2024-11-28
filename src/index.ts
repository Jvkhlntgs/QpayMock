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
      `https://qpaymock.onrender.com/interAB?serviceName=${name}&bookingId=${bookingId}&eventId=${eventId}&venues=${venues}`
    );

    console.log(
      `https://qpaymock.onrender.com/interAB?serviceName=${name}&bookingId=${bookingId}&eventId=${eventId}&venues=${venues}`,
      "qrCodeDataUrlqrCodeDataUrlqrCodeDataUrl"
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

  console.log(venues, "venuesvenuesvenuesvenues");

  const qr = await callGQLQr(serviceName, bookingId, eventId, venues);
  res.status(200).send(qr);
});

app.get("/interAB", async (req: Request, res: Response) => {
  const { serviceName, bookingId, eventId, venues } = req.query;
  const gg = JSON.parse(venues as any);
  console.log(gg, "iggggggggggggggnterab");
  const ahaha = gg.map((el: any) => {
    if (!el.price) {
      return { ...el, price: 0, quantity: 0 };
    }
    return el;
  });
  console.log(ahaha, "ahahaahahaahaha");

  const variables = {
    input: {
      _id: bookingId,
      eventId,
      venues: ahaha,
    },
  };

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

  try {
    const result = await axios.post(
      BACKENDS[serviceName as string].url,
      { query: BACKENDS[serviceName as string].query, variables },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(result.data, "resultresultresult");

    res.status(200).send("Successfully paid ;");
  } catch (err) {
    res.status(200).send("Uldegdel chin hursenguei ahahah");
  }
});

app.listen(8000, () => {
  console.log("http://localhost:8000");
});
