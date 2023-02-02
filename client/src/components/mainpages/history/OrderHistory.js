import React, { useContext, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";
import axios from "axios";

function OrderHistory() {
  const state = useContext(GlobalState);
  const [history, setHistory] = state.userAPI.history;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token

  useEffect(() => {
    if(token) {
        const getHistory = async() => {
            if(isAdmin) {
                const res = await axios.get(`${URL}/api/checkout`, {
                    headers: {Authorization: token}
                })
                setHistory(res.data)
            } else {
                const res = await axios.get(`${URL}/user/history`, {
                    headers: {Authorization: token}
                })
                setHistory(res.data)
            }
        }
        getHistory()
    }
  },[token, isAdmin, setHistory])

  return (
    <div className="history-page">
      <h2>Historial</h2>

      <h4>{history.length} Pedidos realizados</h4>
      <table>
        <thead>
          <tr>
            <th>ID de Compra</th>
            <th>Fecha de Compra</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {history.map((items) => (
            <tr key={items._id}>
              <td>{items.paymentID}</td>
              <td>{new Date(items.createdAt).toLocaleDateString()}</td>
              <td>
                <Link to={`/history/${items._id}`}>Ver</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderHistory;
