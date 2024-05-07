import React from 'react'
import {Elements} from "@stripe/react-stripe-js"
import {loadStripe} from '@stripe/stripe-js/pure'
import PaymentForm from "./PaymentForm"


const PUBLIC_KEY = "pk_test_51LtchoAFQmnyRAMEq05H1iEqXJH6mZCjb291UcsjvWllBUoZYTja9MCPh9D6jcxHt4nyslciK6gg6LD2BYFex2lN00h2a0lExY";

const stripeTestPromise = loadStripe(PUBLIC_KEY);
export default function StripeContainer() {
  return (
    <Elements stripe={stripeTestPromise}>
        <PaymentForm />

    </Elements>
  )
} 
