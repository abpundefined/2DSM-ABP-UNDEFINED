import express from "express";
import cors from "cors";
import navigationRoutes from "./routes/navigation.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/navigation", navigationRoutes);


app.get("/", (req, res) => {
  res.json({ message: "Backend funcionando" });
});

const port = process.env.PORT || 3000;


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});