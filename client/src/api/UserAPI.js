import {useState, useEffect} from 'react';
import axios from 'axios'

function UserAPI(token) {
    const [isLogged, setIsLogged] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [cart, setCart] = useState([])
    const [user, setUser] = useState()
    const [history, setHistory] = useState([])

    useEffect(() => {
        if(token) {
            const getUser = async ()=> {
                try {
                    const res = await axios.get(`${URL}/user/infor`, {
                        headers: {Authorization: token}
                    })

                    setIsLogged(true)
                    res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false)

                    setCart(res.data.cart)
                    setUser(res.data)
                    
                } catch (err) {
                    alert(err.response.data.msg)
                }
            }

            getUser()
        }
    }, [token])

    const addCart = async (product) => {
        if(!isLogged) return alert("Logeate para continuar comprando")

        const check = cart.every(item => {
            return item._id !== product._id
        })

        if(check) {
            setCart([...cart, {...product, quantity: 1}])

            await axios.patch(`${URL}/user/addcart`, {cart: [...cart, {...product, quantity: 1}]}, {
                headers: {Authorization: token}
            })
        } else {
            alert("Este producto ya ha sido agregado")
        }
    }

    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        cart: [cart, setCart],
        addCart: addCart,
        user: [user, setUser],
        history: [history, setHistory],
    }
}

export default UserAPI 