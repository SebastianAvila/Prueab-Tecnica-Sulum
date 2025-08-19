const express = require("express");
const Product = require("../models/product");
const { json } = require("sequelize");
const router = express.Router();

// Crear producto
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar productos
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({ raw: true });

    const response = products.map((p) => ({
      ...p, // mantiene todos los campos originales: id, name, quantity, price, createdAt, updatedAt
      stock_status: p.quantity > 0 ? "Disponible" : "Agotado", // campo calculado
    }));

    res.status(200).json(response); //Envai respuesta
  } catch (err) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Obtener un producto
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk({ raw: true }, req.params.id);
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });

    const response = product.map((p) => ({
      ...p, // mantiene todos los campos originales: id, name, quantity, price, createdAt, updatedAt
      stock_status: p.quantity > 0 ? "Disponible" : "Agotado", // campo calculado
    }));

    res.status(200).json(response); //Envai respuesta
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar producto
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });

    await product.update(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar producto
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });

    await product.destroy();
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
