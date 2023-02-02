const router = require('express').Router();
const cloudinary = require('cloudinary');
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const fs = require('fs');
const { error } = require('console');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

// Upload image only admin can use
router.post('/upload', auth, authAdmin, (req, res) => {
    try {
        console.log(req.files)
        if(!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({msg:'Ningun archivo fue subido'})
            
        const file = req.files.file;
        if(file.size > 1024*1024) {
            removeTemp(file.tempFilePath)
            return res.status(400).json({msg: "Imagen demasiado pesada"})
        }

        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
            removeTemp(file.tempFilePath)
            return res.status(400).json({msg: "Formato de la imagen no valido"});
        }
        
        cloudinary.v2.uploader.upload(file.tempFilePath, {folder: "test"}, async(err, result)=>{
            if(err) throw err;
    
            removeTemp(file.tempFilePath)

            res.json({public_id: result.public_id, url: result.secure_url})
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

// Delete image only admin can use
router.post('/destroy', auth, authAdmin, (req, res)=> {
    try {
        const {public_id} = req.body;
        if(!public_id) return res.status(400).json({msg:'Ninguna imagen seleccionada'})

        cloudinary.v2.uploader.destroy(public_id, async(err, result)=>{
            if(err) throw error;

            res.json({msg: 'Imagen eliminada'})
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

const removeTemp = (path)=> {
    fs.unlink(path, err => {
        if(err) throw err;
    })
}

module.exports = router