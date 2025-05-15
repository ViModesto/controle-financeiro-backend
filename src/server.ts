import app from "./index";

const PORT = process.env.PORT || 4000;
process.env.JWT_SECRET;

app.listen(PORT,() => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
