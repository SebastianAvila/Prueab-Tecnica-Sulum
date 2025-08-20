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

  return (
    <div className="p-6 max-w-3xl mx-auto text-black w-full min-h-[auto] bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-black">
        Catálogo de Productos
      </h1>
      <table className="w-full border-collapse text-left bg-white shadow-sm">
        <thead>
          <tr className="border-b border-black">
            <th className="py-2">Nombre</th>
            <th className="py-2">Cantidad</th>
            <th className="py-2">Precio</th>
            <th className="py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-black">
              <td className="py-2">{product.name}</td>
              <td className="py-2">{product.quantity}</td>
              <td className="py-2">{product.price}</td>
              <td className="py-2 space-x-2">
                <button
                  onClick={() => handleEdit(product.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-400"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-400"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
