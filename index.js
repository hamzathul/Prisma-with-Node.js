import express from "express";
import categoryRoutes from "./routes/categoryRoute.js";

const app = express();
app.use(express.json());
app.use("/categories", categoryRoutes);

app.listen(3000, () => console.log("Server started on port 3000"));
