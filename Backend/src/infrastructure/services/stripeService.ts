import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const createCheckoutSession = async (amount: number, appointmentId: string): Promise<Stripe.Checkout.Session> => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Doctor Appointment",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/paymentsuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/paymentfailure?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        appointmentId: appointmentId, 
      },
    });
    return session;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new Error("Failed to create Stripe checkout session");
  }
};

export const retrieveSession = async (sessionId: string):  Promise<Stripe.Checkout.Session> => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error('Error retrieving Stripe session:', error);
    throw error; 
  }
}

