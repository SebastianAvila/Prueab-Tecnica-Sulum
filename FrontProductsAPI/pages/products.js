// FrontProductsAPI/pages/products.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function ProductsPage() {
  const [newProduct, setNewProduct] = useState({ name: "", price: "" });
  const [products, setProducts] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:4000/products");
        const data = await res.json();
        setProducts(data); // ✅ No slice ni filter, todos los productos se muestran
      } catch (err) {
        console.error("Error al cargar productos:", err);
      }
    };

    fetchProducts();
  }, []);

  //Funcion Delete
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    }
  };
  //Funcion Create
  const handleCreate = async () => {
    const payload = {
      name: newProduct.name.trim(),
      quantity: Number(newProduct.quantity),
      price: Number(newProduct.price),
    };
    if (!payload.name) {
      alert("El nombre es obligatorio");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Si tu back protege con JWT, descomenta:
          // Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error al crear");
      }

      const created = await res.json();

      // Si el back devuelve el producto creado con id:
      if (created && created.id) {
        setProducts((prev) => [...prev, created]);
      } else {
        // Si no devuelve el objeto, recarga la lista:
        await fetchProducts();
      }

      setShowCreate(false);
      setNewProduct({ name: "", quantity: 0, price: 0 });
      alert("Producto creado");
      closeModalCreate(false);
    } catch (e) {
      alert("Error al crear: " + e.message);
    }
  };
  //Funcion Update
  const handleUpdate = async () => {
    if (!selectedProduct) return;

    const payload = {
      name: selectedProduct.name,
      price: Number(selectedProduct.price),
      quantity: Number(selectedProduct.quantity),
    };

    try {
      const response = await fetch(
        `http://localhost:4000/products/${selectedProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Si tu backend exige JWT, descomenta:
            // Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Error al actualizar");
      }

      // Si tu backend devuelve el producto actualizado:
      const updated = await response.json();

      // Actualiza el estado local (si no devuelve nada, usa 'payload' + id):
      setProducts((prev) =>
        prev.map((p) =>
          p.id === (updated?.id ?? selectedProduct.id)
            ? updated || { ...selectedProduct, ...payload }
            : p
        )
      );

      setIsModalOpen(false);
      setSelectedProduct(null);
      alert("Producto actualizado");
    } catch (error) {
      alert("Error al actualizar: " + error.message);
    }
  };

  // Función para abrir modal de edit
  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  // Función para abrir modal de create
  const openModalCreate = (product) => {
    setIsModalOpenCreate(true);
  };

  // Función para cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };
  // Función para cerrar modal create
  const closeModalCreate = () => {
    setIsModalOpenCreate(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // borra el token
    router.push("/"); // redirige al login (index.js)
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-black w-full min-h-[auto] bg-gray-50 divPrin">
      <h1 className="text-3xl font-bold mb-6 text-black">
        Catálogo de Productos
      </h1>

      <table className="w-full center border-collapse text-left bg-white shadow-sm">
        <thead>
          <tr className="border-b border-black">
            <th className="py-2">Nombre</th>
            <th className="py-2">Cantidad</th>
            <th className="py-2">Estado</th>
            <th className="py-2">Precio</th>
            <th className="py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-black">
              <td className="py-2">{product.name}</td>
              <td className="py-2">{product.quantity}</td>
              <td>{product.quantity === 0 ? "No disponible" : "Disponible"}</td>
              <td className="py-2">{product.price}</td>

              <td className="py-2 space-x-2">
                <button
                  onClick={() => openModal(product)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-400"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "¿Seguro que deseas eliminar este registro?"
                      )
                    ) {
                      handleDelete(product.id); // tu función de eliminar
                      alert("Registro eliminado con éxito");
                    }
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-400 deleteb buttonCRUD"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => openModalCreate()}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-400 right created "
      >
        Crear nuevo producto
      </button>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 logout-button"
      >
        Cerrar Sesión
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h1>Editar Producto</h1>
            <h2>Nombre</h2>
            <input
              type="text"
              value={selectedProduct?.name || ""}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, name: e.target.value })
              }
            />
            <h2>Precio</h2>
            <input
              type="number"
              value={selectedProduct?.price || ""}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  price: e.target.value,
                })
              }
            />
            <h2>Cantidad</h2>
            <input
              type="number"
              value={selectedProduct?.quantity || ""}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  quantity: e.target.value,
                })
              }
            />
            <div className="modal-buttons">
              <button onClick={handleUpdate}>Guardar</button>
              <button onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {isModalOpenCreate && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h1>Editar Producto</h1>
            <h2>Nombre</h2>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <h2>Precio</h2>
            <input
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <h2>Cantidad</h2>
            <input
              type="number"
              value={newProduct.quantity}
              onChange={(e) =>
                setNewProduct({ ...newProduct, quantity: e.target.value })
              }
            />
            <div className="modal-buttons">
              <button onClick={handleCreate}>Guardar</button>
              <button onClick={closeModalCreate}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
