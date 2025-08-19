const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const Product = require("./models/product");
const User = require("./models/usuario");
const productRoutes = require("./routes/product.routes");
const authRoutes = require("./routes/auth.routes"); // Asegúrate de que ../models/user.js existe

require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/products", productRoutes);
app.use("/auth", authRoutes);

// Conectar DB y levantar servidor
const PORT = process.env.PORT || 4000;

sequelize
  .sync()
  .then(() => {
    console.log("✅ Base de datos sincronizada");
    app.listen(PORT, () =>
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ Error al conectar DB:", err));
