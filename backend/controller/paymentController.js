import handleAsyncError from "../middleware/handleAsyncError.js";
import { instance } from "../server.js";
import crypto from "crypto";


// export const processPayment = handleAsyncError(async (req, res) => {
//   console.log("Amount:", req.body.amount);

//   const options = {
//     amount: Number(req.body.amount * 100),
//     currency: "INR",
//   };

//   console.log("Options:", options);

//   const order = await instance.orders.create(options);

//   res.status(200).json({
//     success: true,
//     order,
//   });
// });

//Send API Key

export const processPayment = handleAsyncError(async (req, res, next) => {
  try {
    let amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount"
      });
    }

    // Convert rupees → paise and ensure integer
    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR"
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    console.error("Payment Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


export const sendAPIKey = handleAsyncError(async (req, res) => {
  res.status(200).json({
    key: process.env.RAZORPAY_API_KEY,
  });
});

//Payment Verification
export const paymentVerification = handleAsyncError(async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");
  const isAuthentic = expectedSignature === razorpay_signature;
  if (isAuthentic) {
    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      reference: razorpay_payment_id,
    });
  } else {
    return res.status(200).json({
      success: false,
      message: "Payment verification failed",
    });
  }
});
