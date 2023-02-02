const Users = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { create } = require('../models/userModel');
const Payments = require('../models/paymentModel');

const userCtlr = {
    register: async (req, res) => {
        try {
            const {name, password, email, address} = req.body;

            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg: "El email ya existe"})

            if(password.length < 6)
                return res.status(400).json({msg: "La contraseña tiene que tener un minimo de 6 digitos"})

            // Password encryption
            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                name, password:passwordHash, email, address
            })
            
            // Save mongodb
            await newUser.save()

            // Then create jsonwebtoken to authentication 
            const accesstoken = createAccessToken({id: newUser._id})
            const refreshtoken = createRefreshToken({id: newUser._id})
            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refreshtoken',
                maxAge: 7*24*60*60*1000 // 7d
            })

            res.json({accesstoken})

            //res.json({msg: "Registrado"})

        } catch (err) {
            return res.status(500).json({ error: err.message});
        }
    },
    login: async (req, res) => {
        try {
            const {email, password} = req.body;

            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: "El usuario no existe"})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Contraseña incorrecta"})

            // If login success, create access tokend and refresh token
            const accesstoken = createAccessToken({id: user._id})
            const refreshtoken = createRefreshToken({id: user._id})

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refreshtoken',
                maxAge: 7*24*60*60*1000 // 7d
            })

            res.json({accesstoken})

        } catch (err) {
            return res.status(500).json({ error: err.message});
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {path: '/user/refreshtoken'})
            return res.json({msg: 'Secion cerrada'})
        } catch (err) {
            return res.status(500).json({ error: err.message});
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token) return res.status(400).json({msg: "Por favor, registrarse o logearse"});

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if(err) return res.status(400).json({msg: "Por favor, registrarse o logearse"});

                const accesstoken = createAccessToken({id: user.id})

                res.json({accesstoken})
            })

            
        } catch (err) {
            return res.status(500).json({ error: err.message});
        }
       
    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({ error: "El usuario no existe"});
            res.json(user)
        } catch (err) {
            return res.status(500).json({ error: err.message});
        }
    },
    addCart: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id)
            if(!user) return res.status(400).json({ msg: "El usuario no existe"});

            await Users.findOneAndUpdate({_id: req.user.id}, {
                cart: req.body.cart
            })

            return res.json({msg: "Agregado al carrito"})
        } catch (err) {
            return res.status(500).json({ error: err.message});
        }
    },
    history: async (req, res) => {
        try {
            const history = await Payments.find({user_id: req.user.id})

            res.json(history)
        } catch (err) {
            return res.status(500).json({ error: err.message});
        }
    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '11m'})
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

module.exports = userCtlr