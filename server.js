require ('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const path = require('path')

const Payments = require('./models/paymentModel')

const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_BACK);

const app = express()
app.use(cors({ origin: process.env.URL_FRONTEND }));
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles: true,
}))

mongoose.set('strictQuery', false)

// Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/categoryRouter'))
app.use('/api', require('./routes/upload'))
app.use('/api', require('./routes/productRouter'))
app.use('/api', require('./routes/paymentRouter'))

app.get('/', (req, res) => {
    res.json({msg: 'Response'})
})

// Checkout route
app.post("/api/checkout", async (req, res) => {
    const { id, amount, cart, user} = req.body;

    try {

        const {_id, name, email, address} = user;

        await stripe.paymentIntents.create({
            amount,
            currency: "USD",
            description: "",
            payment_method: id,
            confirm: true, //confirm the payment at the same time
        });

        const newPayment = new Payments({
            user_id: _id, name, email, cart, paymentID: id, address
        })
        
        await newPayment.save()
        res.json({msg: 'Pago completado'});

    } catch (error) {
        console.log(error);
        return res.json({ msg: error.message});
    }
});

// Coneccion mongoose
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {}, err => {
    if(err) throw err;
    console.log('Connected to MongoDB')
})

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req,res) => {
        res.sendFile(path.join(_dirname, 'client', 'build', 'index.html'));
    })
}

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=> {
    console.log('Server is running on port', PORT)
})