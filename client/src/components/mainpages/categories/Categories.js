import React, {useState, useContext} from 'react'
import { GlobalState } from '../../../GlobalState'
import axios from 'axios'

function Categories() {
    const state = useContext(GlobalState)
    const [categories] = state.CategoriesAPI.categories
    const [category, setCategory] = useState('')
    const [token] = state.token
    const [callback, setCallback] = state.CategoriesAPI.callback
    const [onEdit, setOnEdit] = useState(false)
    const [id, setId] = useState('')

    const createCategory = async e => {
        e.preventDefault()
        try {
            if(onEdit) {
                const res = await axios.put(`${URL}/api/category/${id}`, {name: category}, {
                    headers: {Authorization: token}
                })
                alert(res.data.msg)
            } else {
                const res = await axios.post(`${URL}/api/category`, {name: category}, {
                    headers: {Authorization: token}
                })
                alert(res.data.msg)
            }
            setOnEdit(false)
            setCategory('')
            setCallback(!callback)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const editCategory = async (id, name) => {
        setId(id)
        setCategory(name)
        setOnEdit(true)
    }

    const deleteCategory = async id => {
        try {
            const res = await axios.delete(`${URL}/api/category/${id}`, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback(!callback)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

  return (
    <div className='categories'>
        <form onSubmit={createCategory}>
            <label htmlFor="category">Categorias</label>
            <input type="text" name='category' value={category} onChange={e => setCategory(e.target.value)} required />

            <button type='submit'>{onEdit ? "Actualizar" : "Crear"}</button>
        </form>

        <div className="col">
            {
                categories.map(category => (
                    <div className='row' key={category._id}>
                        <p>{category.name}</p>
                        <div>
                            <button onClick={() => editCategory(category._id, category.name)}>Editar</button>
                            <button onClick={() => deleteCategory(category._id)}>Eliminar</button>
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default Categories