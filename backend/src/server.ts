import express from "express";
import cors from "cors";
import navigationRoutes from "./routes/navigation.routes";
import authRouter from "./routes/auth.routes"; // ← adicionar
import inquiryRoutes from "./routes/inquiry.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/navigation", navigationRoutes);
app.use("/auth", authRouter); // ← adicionar
app.use("/inquiries", inquiryRoutes); // Rota de dúvidas enviadas pelo formulário

app.get("/", (req, res) => {
  res.json({ message: "Backend funcionando" });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});