import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProduct = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(422).json({ error: "Name is required" });
    }
    if (!req.body.price) {
      return res.status(422).json({ error: "Price is required" });
    } else {
      if (typeof req.body.price !== "number" || req.body.price < 0) {
        return res
          .status(422)
          .json({ error: "Price must be a non negative number" });
      }
    }
    if (!req.body.categoryId) {
      return res.status(422).json({ error: "Category id is required" });
    } else {
      if (
        !(await prisma.category.findUnique({
          where: { id: parseInt(req.body.categoryId) },
        }))
      ) {
        return res.status(404).json({ error: "Category id not found" });
      }
    }

    const newProduct = await prisma.product.create({
      data: req.body,
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in create product controller:", error.message);
  }
};
