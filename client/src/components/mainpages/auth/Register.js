import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios' 

function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const registerSubmit = async e => {
    e.preventDefault()
    try {
      await axios.post(`${URL}/user/register`, {...user})
      
      localStorage.setItem('firstLogin', true)

      window.location.href = "/";
    } catch (err) {
      alert(err.response.data.msg)
    }
  }

  return (
    <div className="login-page">
      <form onSubmit={registerSubmit}>
        <h2>Registrarse</h2>
        <input
          type="text"
          name="name"
          required
          placeholder="Nombre"
          value={user.name}
          onChange={onChangeInput}
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          value={user.email}
          onChange={onChangeInput}
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Contraseña"
          value={user.password}
          onChange={onChangeInput}
        />
        <input
          type="text"
          name="address"
          required
          placeholder="Direccion"
          value={user.address}
          onChange={onChangeInput}
        />
        <div className="row">
          <button type="submit">Registrarte</button>
          <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;