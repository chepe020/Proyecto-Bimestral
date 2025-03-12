import Categoria from "./categoria.model.js";
import Producto from "../producto/producto.model.js";

export const saveCategory = async (req, res) => {
    try {
        const { name } = req.body;

        const category = new Categoria({  
            name,
        });

        await category.save();

        res.status(201).json({
            success: true,
            msg: "Categoría creada exitosamente",
            category,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al crear la categoría",
            error: error.message || error,
        });
    }
};

export const getCategory = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, categories] = await Promise.all([
            Categoria.countDocuments(query),  
            Categoria.find(query)  
                .skip(Number(desde))
                .limit(Number(limite)),
        ]);

        return res.status(200).json({
            success: true,
            msg: "Categorías obtenidas exitosamente",
            total,
            categories,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al obtener las categorías",
            error: error.message || error,
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const categoryToDelete = await Categoria.findById(id);  // Cambiar Category por Categoria
        if (!categoryToDelete) {
            return res.status(404).json({
                success: false,
                msg: "Categoría no encontrada",
            });
        }

        // Asigna la categoría 'Reciclado' a los productos de la categoría eliminada
        const categoryReciclado = await Categoria.findOne({ name: "Reciclado" });  // Cambiar Category por Categoria

        await Producto.updateMany(  // Cambiar Product por Producto
            { category: categoryToDelete._id },
            { category: categoryReciclado._id }
        );

        // Elimina la categoría
        await Categoria.findByIdAndDelete(id);  // Cambiar Category por Categoria

        res.status(200).json({
            success: true,
            msg: "Categoría eliminada correctamente",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al eliminar la categoría",
            error: error.message || error,
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, name, ...data } = req.body;

        const category = await Categoria.findByIdAndUpdate(id, data, { new: true });  // Cambiar Category por Categoria
        category.name = name;
        await category.save();

        res.status(200).json({
            success: true,
            msg: "Categoría actualizada exitosamente",
            category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar la categoría",
            error: error.message || error,
        });
    }
};
