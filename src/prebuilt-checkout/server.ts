import Stripe from "stripe";
import express, { type Request, type Response } from "express";
import { createServer } from "http";
import { join } from "path";
import { STRIPE_API } from "../config";

const DOMAIN = "http://127.0.0.1";
const PORT = 8888;

const app = express();
app.use(express.static(join(__dirname, "public")));

const stripe = new Stripe(STRIPE_API.testSecretKey, {
  apiVersion: "2022-08-01",
});

createServer(app).listen(PORT, () => console.log("API is online"));

app.post("/create-checkout-session", async (_req: Request, res: Response) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: "price_1LrgaYGTlUc7fyg4WO4iZ2rL",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${DOMAIN}:${PORT}/success.html`,
    cancel_url: `${DOMAIN}:${PORT}/cancel.html`,
  });

  return res.status(303).redirect(session.url);
});
