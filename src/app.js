import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import mocksRouter from "./routes/mocks.router.js";
import { addLogger } from "./middlewares/logger.middleware.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./swagger/swagger.config.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());
app.use(addLogger);

app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/mocks", mocksRouter);

app.use("/apidocs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB");

    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    });
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
    process.exit(1);
  }
};

startServer();

app.get("/", (req, res) => {
  req.logger.info("Ruta raíz accedida correctamente");
  req.logger.warn("¡Alerta!");
  res.send("Logger funcionando!");
});
