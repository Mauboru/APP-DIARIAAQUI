import express, { Request, Response, ErrorRequestHandler } from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import apiRoutes from "./routes/Routes";
import { sequelize } from "./instances/mysql";

dotenv.config();

const app = express(); 

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || "*";

app.use(
  cors({
    origin: (origin, callback) => {
      if (origin?.startsWith("http://192.168.")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.static(path.join(__dirname, "../public")));

app.use(express.json());

app.get("/ping", (req: Request, res: Response) => res.json({ pong: true }));

app.use(apiRoutes);

app.use((req: Request, res: Response) => {
  res.status(404);
  res.json({ error: "Endpoint não encontrado." });
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(400);
  console.log(err);
  res.json({ error: "Ocorreu algum erro." });
};
app.use(errorHandler);

export { app };

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}