import React, {useState, useEffect, useContext} from 'react'
import {useParams} from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'

function OrderDetail() {
    const state = useContext(GlobalState)
    const [history] = state.userAPI.history
    const [orderDetail, setOrderDetail] = useState([])

    const params = useParams()

    useEffect(() => {
        if(params.id) {
            history.forEach(item => {
                if(item._id === params.id) setOrderDetail(item)
            })
        }
    }, [params.id, history])

    if(orderDetail.length === 0) return null
  return (
    <div className='history-page'>
        <table>
            <thead>
            <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Email</th>
            </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{orderDetail.name}</td>
                    <td>{orderDetail.address}</td>
                    <td>{orderDetail.email}</td>
                </tr>
            </tbody>
        </table>

        <table>
            <thead>
            <tr>
                <th></th>
                <th>Products</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>
            </thead>
            <tbody>
                {
                    orderDetail.cart.map(item => (
                        <tr key={item._id}>
                            <td><img alt='' src={item.images}/></td>
                            <td>{item.title}</td>
                            <td>{item.quantity}</td>
                            <td>$ {item.price * item.quantity}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    </div>
  )
}

export default OrderDetail