import React, { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Card } from "@mui/material";
import axios from "axios";

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#ff8514",
      color: "#ff8514",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":webkit-autofill": { color: "#ff8514" },
      "::placeholder": { color: "#ff8514" },
    },
    invalid: {
      iconColor: "#ff8514",
      color: "#ff8514",
    },
  },
};

export default function PaymentForm() {
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();



  return (
    <>
      {!success ? (
        <form>
          <fieldset className="FormGroup">
            <div className="FormRow">
              <CardElement options={CARD_OPTIONS} />
            </div>
          </fieldset>
        </form>
      ) : (
        <div>
          <h2>Welcome to Flex Visual!</h2>
        </div>
      )}
    </>
  );
}
