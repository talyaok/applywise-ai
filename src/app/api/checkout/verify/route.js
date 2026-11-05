import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function GET(request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");

  if (!sessionId || !sessionId.startsWith("cs_test_")) {
    return NextResponse.json(
      { error: "Invalid checkout session." },
      { status: 400 }
    );
  }

  const key = process.env.STRIPE_SECRET_KEY;

  if (!key || !key.startsWith("sk_test_")) {
    return NextResponse.json(
      { error: "Stripe test mode is not configured." },
      { status: 503 }
    );
  }

  try {
    const stripe = new Stripe(key);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const verified =
      session.payment_status === "paid" &&
      session.mode === "payment" &&
      session.amount_total === 990 &&
      session.currency === "myr";

    return NextResponse.json({
      verified,
      status: session.payment_status,
      product: "ApplyWise Pro — Demo",
      amount: session.amount_total,
      currency: session.currency,
      mode: "sandbox",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to verify checkout session." },
      { status: 400 }
    );
  }
}
