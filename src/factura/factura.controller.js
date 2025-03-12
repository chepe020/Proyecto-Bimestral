import Carrito from '../carrito/carito.model.js';
import Producto from '../producto/producto.model.js';
import Factura from './factura.model.js';
import User from "../users/user.model.js";

export const saveFactura = async (req, res) => {
    try {
        const { name } = req.body;

        // Verifica si el usuario existe
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                msg: "Usuario no encontrado" 
            });
        }

        // Verifica si el carrito existe y tiene productos
        const cart = await Carrito.findOne({ user: user._id }).populate("products.product");
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ 
                success: false, 
                msg: "El carrito está vacío" 
            });
        }

        let total = 0;

        // Verifica el stock de los productos en el carrito
        for (let item of cart.products) {
            if (item.product.stock < item.quantity) {
                return res.status(400).json({ 
                    success: false, 
                    msg: 'No hay suficiente stock' 
                });
            }
            total += item.product.price * item.quantity;
        }

        // Crea la factura
        const factura = new Factura({
            user: user._id,
            products: cart.products.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            })),
            total
        });

        await factura.save();

        // Actualiza el stock y las unidades vendidas de los productos
        for (let item of cart.products) {
            await Producto.findByIdAndUpdate(item.product._id, { 
                $inc: { stock: -item.quantity, sold: item.quantity }
            });
        }

        // Limpia el carrito
        await Carrito.findByIdAndUpdate(cart._id, { products: [] });

        return res.status(200).json({
            success: true,
            msg: "Compra realizada con éxito",
            factura
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error al procesar la compra",
            error: error.message
        });
    }
};

export const getFactura = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const userAutentico = req.user.id;

        // Obtiene las facturas del usuario autenticado
        const facturas = await Factura.find({ user: userAutentico })
            .skip(Number(desde))
            .limit(Number(limite))
            .populate({
                path: 'user',
                select: 'name lastname'
            })
            .populate({
                path: 'products.product',
                select: 'nameP'
            });

        return res.status(200).json({
            success: true,
            msg: "Facturas encontradas",
            facturas
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al obtener las facturas",
            error: error.message
        });   
    }
};
