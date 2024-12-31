import express from "express";
import categoryRoutes from "./routes/categoryRoute.js";
import productRoutes from "./routes/productRoute.js";

const app = express();
app.use(express.json());

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);

app.listen(3000, () => console.log("Server started on port 3000"));



// {/** Notes  */}

// npm install @prisma/client
// npm install prisma --save-dev
// npx prisma init

// after writing the schemas, migrate it 
// npx prisma  migrate dev --name initial_migration

// npx prisma generate - to refresh the changes
