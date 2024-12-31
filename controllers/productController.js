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
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      omit: {
        categoryId: true,
      },
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in create product controller:", error.message);
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      omit: {
        categoryId: true,
      },
    });

    return res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in getProducts controller:", error.message);
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      omit: {
        categoryId: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in getProductById controller:", error.message);
  }
};

export const updateProduct = async (req, res) => {
  try {
    if (req.body.name !== undefined && req.body.name.trim() === "") {
      return res.status(422).json({ error: "Name cannot be empty" });
    }
    if (
      req.body.price !== undefined &&
      (typeof req.body.price !== "number" || req.body.price < 0)
    ) {
      return res
        .status(422)
        .json({ error: "Price must be a non negative number" });
    }

    if (
      req.body.categoryId !== undefined &&
      !(await prisma.category.findUnique({
        where: { id: req.body.categoryId },
      }))
    ) {
      return res.status(422).json({ error: "Category id not found" });
    }

    const updateProduct = await prisma.product.update({
      data: req.body,
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      omit: {
        categoryId: true,
      },
    });

    return res.status(200).json(updateProduct);
  } catch (error) {
    if (error.code === "P2025")
      return res.status(404).json({ error: "Product not found" });
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
    return res.status(204).send();
  } catch (error) {
    if (error.code === "P2025")
      return res.status(404).json({ error: "Product not found" });
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export const getProductsByCategoryId = async (req, res) => {
  try {
    if (
      !(await prisma.category.findUnique({
        where: { id: parseInt(req.params.categoryId) },
      }))
    ) {
      return res.status(404).json({ error: "Category id not found" });
    }

    const products = await prisma.product.findMany({
      where: { categoryId: parseInt(req.params.categoryId) },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      omit: {
        categoryId: true,
      },

      orderBy:{
        name:"asc"
      }
    });

    return res.status(200).json(products)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};
