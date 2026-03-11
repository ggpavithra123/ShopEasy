import React from "react";
import "../CartStyles/Payment.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CheckoutPath from "./CheckoutPath";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function Payment() {

  const navigate = useNavigate();

  const orderItem = JSON.parse(sessionStorage.getItem("orderItem"));

  const { user } = useSelector((state) => state.user);
  const { shippingInfo } = useSelector((state) => state.cart);

  const completePayment = async (amount) => {

    try {

      // 1️⃣ Get Razorpay Key
      const { data: keyData } = await axios.get(
        "http://localhost:8000/api/v1/getKey",
        { withCredentials: true }
      );

      const key = keyData.key;


      // 2️⃣ Create Razorpay Order
      const { data: orderData } = await axios.post(
        "http://localhost:8000/api/v1/payment/process",
        { amount },
        { withCredentials: true }
      );

      const order = orderData.order;


      // 3️⃣ Razorpay Checkout Options
      const options = {
        key: key,
        amount: order.amount,
        currency: "INR",
        name: "ShopEasy",
        description: "Ecommerce Website Payment Transaction",
        order_id: order.id,

        handler: async function (response) {

          try {

            // 4️⃣ Verify Payment
            const { data } = await axios.post(
              "http://localhost:8000/api/v1/paymentVerification",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              },
              { withCredentials: true }
            );

            if (data.success) {

              navigate(`/paymentSuccess?reference=${data.reference}`);

            } else {

              toast.error("Payment verification failed");

            }

          } catch (error) {

            toast.error("Verification failed");

          }

        },

        prefill: {
          name: user?.name,
          email: user?.email,
          contact: shippingInfo?.phoneNumber
        },

        theme: {
          color: "#3399cc"
        }

      };


      // 5️⃣ Open Razorpay Checkout
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {

      toast.error(error.response?.data?.message || error.message, {
        position: "top-center",
        autoClose: 3000
      });

    }

  };


  return (
    <>
      <PageTitle title="Payment Processing" />

      <Navbar />

      <CheckoutPath activePath={2} />

      <div className="payment-container">

        <Link to="/order/confirm" className="payment-go-back">
          Go Back
        </Link>

        <button
          className="payment-btn"
          onClick={() => completePayment(orderItem.total)}
        >
          Pay ({orderItem.total})/-
        </button>

      </div>

      <Footer />
    </>
  );
}

export default Payment;