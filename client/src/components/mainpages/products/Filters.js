import React, {useContext} from 'react'
import {GlobalState} from '../../../GlobalState'

function Filters() {
    const state = useContext(GlobalState)
    const [categories] = state.CategoriesAPI.categories

    const [category, setCategory] = state.productsAPI.category
    const [sort, setSort] = state.productsAPI.sort
    const [search, setSearch] = state.productsAPI.search

    const handleCategory = e => {
        setCategory(e.target.value)
        setSearch('')
    }

  return (
    <div className='filter_menu'>
        <div className="row">
            <span>Filtros: </span>
            <select name="category" value={category} onChange={handleCategory}>
                <option value="">Todos los productos</option>
                {
                    categories.map(category => (
                        <option value={"category=" + category._id} key={category._id}>
                            {category.name}
                        </option>
                    ))
                }
            </select>
        </div>

        <input type="text"  value={search} placeholder="Ingresa tu busqueda" onChange={e => setSearch(e.target.value.toLowerCase())}/>
        
        <div className="row sort">
            <span>Ordenar por: </span>
            <select name="category" value={sort} onChange={e => setSort(e.target.value)}>
                <option value="">Mas Nuevo</option>
                <option value="sort=oldest">Mas Antiguo</option>
                <option value="sort=-sold">Mas Vendidos</option>
                <option value="sort=-price">Precio: Mayor-Menor</option>
                <option value="sort=price">Precio: Menor-Mayor</option>
            </select>
        </div>
    </div>
  )
}

export default Filters