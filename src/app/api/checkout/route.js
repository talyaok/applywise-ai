import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const key = process.env.STRIPE_SECRET_KEY;

    if (!key || !key.startsWith("sk_test_")) {
      return NextResponse.json(
        { error: "Stripe test mode is not configured." },
        { status: 503 }
      );
    }

    const origin = new URL(request.url).origin;
    const stripe = new Stripe(key);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "myr",
            unit_amount: 990,
            product_data: {
              name: "ApplyWise Pro — Demo",
              description: "One-time test purchase for capstone demonstration",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error.message);
    return NextResponse.json(
      { error: "Unable to start test checkout." },
      { status: 500 }
    );
  }
}
