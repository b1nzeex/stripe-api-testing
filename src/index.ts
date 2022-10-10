import express, { Request, Response } from "express";
import { createServer } from "http";
import axios from "axios";
import qs from "qs";
import { STRIPE_API } from "./config";

enum HttpStatus {
  "OK" = 200,
}

interface CreditCard {
  exp_month: number;
  exp_year: number;
  number: string;
  cvc: number;
}

// Start our Express API
const app = express();
app.use(express.json());
createServer(app).listen(8888, () => console.log("API is online"));

// Since we will be re-using these headers in axios requests, we will define a variable for them
const requestHeaders = {
  Authorization: `Bearer ${STRIPE_API.testSecretKey}`,
};

// An Express API endpoint to get our Stripe balance - example of a GET request
app.get("/balance", async (_req: Request, res: Response) => {
  const response = await axios.get(`${STRIPE_API.baseUrl}/balance`, {
    headers: requestHeaders,
  });

  const data = response.data;

  // If the request to Stripe is unsuccessful, we will return an error response on our API
  if (response.status !== HttpStatus.OK) {
    return res.status(response.status).json({
      error: true,
      response: data,
    });
  }

  // Return our Stripe balance on our API
  return res.status(HttpStatus.OK).json({
    error: false,
    response: data,
  });
});

// Create a Stripe payment method - an example of a POST request
app.post("/payment_methods", async (req: Request, res: Response) => {
  // We will get the values of the body
  const { type, card }: { type: string; card: CreditCard } = req.body;

  const response = await axios.post(
    `${STRIPE_API.baseUrl}/payment_methods`,
    qs.stringify({
      type,
      card,
    }),
    {
      headers: requestHeaders,
    }
  );

  const data = response.data;

  // If the request to Stripe is unsuccessful, we will return an error response on our API
  if (response.status !== HttpStatus.OK) {
    return res.status(response.status).json({
      error: true,
      response: data.error?.message,
    });
  }

  // Return our Stripe payment method ID on success
  return res.status(HttpStatus.OK).json({
    error: false,
    response: data.id,
  });
});

// Charge a Stripe payment method - example of POST request
app.post("/payment_intents", async (req: Request, res: Response) => {
  // We will get the values of the body
  const { amount, payment_method }: { amount: number; payment_method: string } =
    req.body;

  const response = await axios.post(
    `${STRIPE_API.baseUrl}/payment_intents`,
    qs.stringify({
      amount,
      payment_method,
      confirm: true,
      currency: "gbp",
    }),
    {
      headers: requestHeaders,
    }
  );

  const data = response.data;

  // If the request to Stripe is unsuccessful, we will return an error response on our API
  if (response.status !== HttpStatus.OK) {
    return res.status(response.status).json({
      error: true,
      response: data.error?.message,
    });
  }

  // Return our Stripe payment method ID on success
  return res.status(HttpStatus.OK).json({
    error: false,
    response: data,
  });
});
