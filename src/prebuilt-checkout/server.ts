import Stripe from "stripe";
import express, { type Request, type Response } from "express";
import { createServer } from "http";
import { join } from "path";
import { EXPRESS_API, STRIPE_API } from "../config";

const app = express();
app.use(express.static(join(__dirname, "public")));

const stripe = new Stripe(STRIPE_API.testSecretKey, {
  apiVersion: "2022-08-01",
});

createServer(app).listen(EXPRESS_API.port, () => console.log("API is online"));

app.post("/create-checkout-session", async (_req: Request, res: Response) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: "price_1LrgaYGTlUc7fyg4WO4iZ2rL",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${EXPRESS_API.domain}:${EXPRESS_API.port}/success.html`,
    cancel_url: `${EXPRESS_API.domain}:${EXPRESS_API.port}/cancel.html`,
  });

  return res.status(303).redirect(session.url);
});
