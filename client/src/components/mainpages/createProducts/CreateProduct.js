import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { GlobalState } from "../../../GlobalState";
import Loading from "../utils/Loading/Loading";
import { useNavigate, useParams } from "react-router-dom";

const initialState = {
  product_id: "",
  title: "",
  price: 0,
  description: "This is a description",
  content: "This is a content",
  category: "",
  _id: "",
};

function CreateProduct() {
  const state = useContext(GlobalState);
  const [product, setProduct] = useState(initialState);
  const [categories] = state.CategoriesAPI.categories;
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  const navigate = useNavigate();
  const param = useParams();

  const [products] = state.productsAPI.products;
  const [onEdit, setOnEdit] = useState(false);
  const [callback, setCallback] = state.productsAPI.callback

  useEffect(() => {
    if (param.id) {
        setOnEdit(true)
        products.forEach((product) => {
            if (product._id === param.id) {
            setProduct(product);
            setImages(product.images);
            }
        });
    } else {
        setOnEdit(false)
        setProduct(initialState);
        setImages(false);
    }
  }, [param.id, products]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("No tienes permisos de administrador");
      const file = e.target.files[0];

      if (!file) return alert("El archivo no existe");

      if (file.size > 1024 * 1024) return alert("Imagen demasiado grande");

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return alert("Formato de imagen invalido");

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      const res = await axios.post(`${URL}/api/upload`, formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });

      setLoading(false);
      setImages(res.data);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleDestroy = async () => {
    try {
      if (!isAdmin) return alert("No tienes permisos de administrador");
      setLoading(true);
      await axios.post(
        `/api/destroy`,
        { public_id: images.public_id },
        {
          headers: { Authorization: token },
        }
      );
      setLoading(false);
      setImages(false);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("No tienes permisos de administrador");
      if (!images) return alert("No tienes una imagen cargada");

      if(onEdit) {
        await axios.put(`${URL}/api/products/${product._id}`,{ ...product, images },{
            headers: { Authorization: token },
        });
      } else {
        await axios.post(`${URL}/api/products`,{ ...product, images },{
              headers: { Authorization: token },
        });
      }
      setCallback(!callback)
      navigate("/");

    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const styleUpload = {
    display: images ? "block" : "none",
  };

  return (
    <div className="create_product">
      <div className="upload">
        <input type="file" name="file" id="file_up" onChange={handleUpload} />
        {loading ? (
          <div id="file_img">
            <Loading />
          </div>
        ) : (
          <div id="file_img" style={styleUpload}>
            <img src={images ? images.url : ""} alt="" />
            <span onClick={handleDestroy}>X</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <label htmlFor="product_id">ID</label>
          <input
            type="text"
            name="product_id"
            id="product_id"
            value={product.product_id}
            onChange={handleChangeInput}
            disabled={onEdit}
            required
          />
        </div>
        <div className="row">
          <label htmlFor="title">Titulo</label>
          <input
            type="text"
            name="title"
            id="title"
            value={product.title}
            onChange={handleChangeInput}
            required
          />
        </div>
        <div className="row">
          <label htmlFor="price">Precio</label>
          <input
            type="number"
            name="price"
            id="price"
            value={product.price}
            onChange={handleChangeInput}
            required
          />
        </div>
        <div className="row">
          <label htmlFor="description">Descripcion</label>
          <textarea
            type="text"
            name="description"
            id="description"
            value={product.description}
            onChange={handleChangeInput}
            rows="5"
            required
          />
        </div>
        <div className="row">
          <label htmlFor="content">Contenido</label>
          <textarea
            type="text"
            name="content"
            id="content"
            value={product.content}
            onChange={handleChangeInput}
            rows="7"
            required
          />
        </div>
        <div className="row">
          <label htmlFor="categories">Categorias: </label>
          <select
            name="category"
            value={product.category}
            onChange={handleChangeInput}
          >
            <option value="">Selecciona una categoria</option>
            {categories.map((category) => (
              <option value={category._id} key={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">{onEdit ? "Actualizar" : "Crear"}</button>
      </form>
    </div>
  );
}

export default CreateProduct;
