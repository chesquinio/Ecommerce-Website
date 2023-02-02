import React, { useContext, useState, useEffect } from "react";
import "bootswatch/dist/lux/bootstrap.min.css";
import {GlobalState} from '../../../GlobalState'
import "./cart.css";

import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import axios from "axios";
import { redirect } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51MK4PRE3Kvn3JVEKeCtf0HezElUo6DjFQUUgahZeaGU9JznDIunKsHOsNyhE1s5VbyxidTAMNOL4A9MNi8x2ohkB00uYnrW4KV");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  
  const state = useContext(GlobalState)
  const [cart, setCart] = state.userAPI.cart
  const [total, setTotal] = useState(0)
  const [user] = state.userAPI.user
  const [token] = state.token

  const [loading, setLoading] = useState(false);

  useEffect(()=> {
    const getTotal = () => {
      const total = cart.reduce((prev, item) => {
        return prev + (item.price * item.quantity)
      }, 0)

      setTotal(total)
    }
    getTotal()
  }, [cart])

  const addToCart = async (cart) =>{
    await axios.patch(`${URL}/user/addcart`, {cart}, {
        headers: {Authorization: token}
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    setLoading(true);

    if (!error) {
      // console.log(paymentMethod)
      const { id } = paymentMethod;
      try {
        let amount_total = total * 100
        await axios.post(`${URL}/api/checkout`, { id, amount: amount_total, cart, user});

        elements.getElement(CardElement).clear();
        setCart([])
        addToCart([])
        alert("Tu compra se ha realizado con exito")
        redirect('/')

      } catch (error) {
        alert("Hubo un problema en la compra")
        console.log(error);
      }
      setLoading(false);
    }
  };

  console.log(!stripe || loading);

  return (
        <form className="card card-body mt-5" onSubmit={handleSubmit}>
        {/* Product Information */}
        <img
            src=""
            alt=""
            className="img-fluid"
        />

        <h3 className="text-center my-2">Precio: ${total}</h3>

        {/* User Card Input */}
        <div className="form-group p-3">
            <CardElement />
        </div>

        <button disabled={!stripe} className="btn btn-success">
            {loading ? (
            <div className="spinner-border text-light" role="status">
                <span className="sr-only">Cargando...</span>
            </div>
            ) : (
            "Buy"
            )}
        </button>
        </form>  
  );
};

 function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <div className="container p-4">
        <div className="row h-100">
          <div className="col-md-4 offset-md-4 h-100">
            <CheckoutForm />
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default Checkout;