import mongoose from "mongoose";
import { response } from "express";
import Categoria from "../categoria/categoria.model.js";
import Producto from "./producto.model.js"; // Asegúrate que el modelo Producto esté bien exportado

// Crear un producto
export const saveProduct = async (req, res) => { 
    try {
        const data = req.body;

        // Buscar la categoría correctamente
        const categoria = await Categoria.findOne({ name: data.category }); 
        if (!categoria) {
            return res.status(404).json({
                success: false,
                message: "Categoría no encontrada"
            });
        }

        // Crear el producto con la categoría correcta
        const producto = new Producto({
            ...data,
            stock: Number(data.stock), // Convertir stock a número si viene como string
            category: categoria._id
        });

        await producto.save();

        return res.status(200).json({
            success: true,
            producto
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al crear el producto",
            error: error.message
        });
    }
};


// Obtener productos con paginación
export const getProduct = async (req, res) => {
    const limite = Number(req.query.limite) || 10;
    const desde = Number(req.query.desde) || 0;
    const query = { status: true };

    try {
        const [total, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .populate({ path: "category", select: "nameP" }) 
                .skip(desde)
                .limit(limite)
        ]);

        return res.status(200).json({
            success: true,
            total,
            productos
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al obtener los productos",
            error: error.message
        });
    }
};

// Eliminar producto (desactivándolo)
export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({
                success: false,
                msg: "Producto no encontrado"
            });
        }

        producto.status = false;
        await producto.save();

        return res.status(200).json({
            success: true,
            msg: "Producto eliminado exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al eliminar el producto",
            error: error.message
        });
    }
};

// Actualizar producto
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, category, ...data } = req.body; 

        // Verificar si el producto existe
        const productoExistente = await Producto.findById(id);
        if (!productoExistente) {
            return res.status(404).json({
                success: false,
                msg: "Producto no encontrado"
            });
        }

        // Si se envía una categoría, verificar que exista
        if (category) {
            const categoria = await Categoria.findOne({ name: category });
            if (!categoria) {
                return res.status(400).json({
                    success: false,
                    msg: "Categoría no encontrada"
                });
            }
            data.category = categoria._id;
        }

        // Actualizar el producto
        const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

        return res.status(200).json({
            success: true,
            msg: "Producto actualizado exitosamente",
            producto
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar el producto",
            error: error.message
        });
    }
};


// Obtener un producto por ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar si el ID es un ObjectId válido de MongoDB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                msg: "ID de producto no válido"
            });
        }

        const producto = await Producto.findById(id)
            .populate({ path: "category", select: "name" });

        if (!producto) {
            return res.status(404).json({
                success: false,
                msg: "Producto no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            producto
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al buscar el producto",
            error: error.message
        });
    }
};

// Obtener productos sin stock
export const getStockA = async (req, res) => {
    try {
        const productos = await Producto.find({ stock: 0 })
            .populate({ path: "category", select: "nameP" }); 

        return res.status(200).json({
            success: true,
            total: productos.length,
            productos
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al obtener los productos sin stock",
            error: error.message
        });
    }
};

// Buscar producto por nombre (exacto o parcial)
export const buscarPorNombre = async (req, res) => {
    try {
        const { nameP, exact } = req.query; 

        if (!nameP) {
            return res.status(400).json({
                success: false,
                msg: "Debes proporcionar un nombre de producto"
            });
        }

        const query = exact === "true"
            ? { nameP: nameP, status: true } 
            : { nameP: { $regex: nameP, $options: "i" }, status: true }; 

        const productos = await Producto.find(query)
            .populate({ path: "category", select: "nameP" });

        if (productos.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "No se encontraron productos con ese nombre"
            });
        }

        return res.status(200).json({
            success: true,
            total: productos.length,
            productos
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al buscar el producto",
            error: error.message
        });
    }
};

// Listar productos ordenados por ventas
export const listSales = async (req, res) => {
    try {
        const limite = Number(req.query.limite) || 10;
        const desde = Number(req.query.desde) || 0;
        const query = { status: true };

        const [total, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .select("nameP sold") 
                .sort({ sold: -1 })
                .skip(desde)
                .limit(limite)
        ]);

        return res.status(200).json({
            success: true,
            msg: "Productos ordenados por mayores ventas",
            total,
            productos
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al obtener productos",
            error: error.message
        });
    }
};
