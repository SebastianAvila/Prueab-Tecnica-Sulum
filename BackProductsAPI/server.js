const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const Product = require("./models/product");
const productRoutes = require("./routes/product.routes");

require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/products", productRoutes);

// Conectar DB y levantar servidor
const PORT = process.env.PORT || 4000;

sequelize
  .sync()
  .then(() => {
    console.log("✅ Base de datos sincronizada");
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
  })
  .catch((err) => console.error("❌ Error al conectar DB:", err));
