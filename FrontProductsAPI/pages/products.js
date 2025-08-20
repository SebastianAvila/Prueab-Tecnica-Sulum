// FrontProductsAPI/pages/products.js
import React, { useState, useEffect } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  // ---- Falla anterior: si hacíamos data.slice(1) perdíamos el primer producto
  // Fetch de productos desde el backend
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

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    }
  };

  const handleEdit = (id) => {
    // Aquí podrías abrir un modal o redirigir a otra página de edición
    console.log("Editar producto con ID:", id);
  };

  // Estado en tu componente principal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Función para abrir modal
  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Función para cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

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
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-400 deleteb"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar Producto</h2>
            <input
              type="text"
              value={selectedProduct?.name || ""}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, name: e.target.value })
              }
            />
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
    </div>
  );
}
