const express = require("express")
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser")
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)

const cors =require("cors");
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//app.listen(process.env.PORT || 5000, () =>)

app.post("/payment", cors(), async (req,res) => {
    let {amount, id }= req.body
    try{
      const payment = await stripe.payment.paymentIntents.create({
        amount,
        currency: "USD",
        description: "Gen Fit",
        payment_method: id,
        confirm: true,
      })
      console.log("Payment", payment)
      res.json({
        message: "Payment Successful",
        success: true
      })
  
    }catch(error)
    {
      console.log("Error:", error)
      res.json({
        message: "Payment Failed",
        success: false
      })
  
  
    }
  })
  app.listen(process.env.PORT || 5000, () => {
    console.log("Server listening");
  })

