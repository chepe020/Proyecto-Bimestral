import Carrito from './carito.model.js';
import Producto from '../producto/producto.model.js';  // Asegúrate de usar 'Producto' si es el nombre correcto del modelo
import User from '../users/user.model.js';

// Guardar productos en el carrito
export const saveCart = async (req, res) => {
    try {
        const { name, products } = req.body;

        // Buscar usuario por nombre
        const user = await User.findOne({ name }).lean();
        if (!user) {
            return res.status(404).json({ success: false, msg: 'Usuario no encontrado' });
        }

        // Buscar carrito del usuario o crear uno nuevo
        let carrito = await Carrito.findOne({ user: user._id });
        if (!carrito) carrito = new Carrito({ user: user._id, products: [] });

        for (const { nameP, quantity } of products) {
            // Buscar producto por nombre
            const product = await Producto.findOne({ nameP }).lean();  
            if (!product) {
                return res.status(404).json({ success: false, msg: `Producto ${nameP} no encontrado` });
            }

            if (quantity > product.stock) {
                return res.status(400).json({ success: false, msg: `Stock insuficiente para ${nameP}` });
            }

            // Verificar si el producto ya está en el carrito
            const productIndex = carrito.products.findIndex(item => item.product.toString() === product._id.toString());

            if (productIndex !== -1) {
                carrito.products[productIndex].quantity += quantity;  // Sumar la cantidad si el producto ya está
            } else {
                carrito.products.push({ product: product._id, quantity });
            }
        }

        await carrito.save();
        return res.status(200).json({ success: true, msg: 'Productos agregados al carrito con éxito', carrito });

    } catch (error) {
        return res.status(500).json({ success: false, msg: 'Error al agregar productos al carrito', error: error.message });
    }
};


// Obtener todos los carritos
export const getCart = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const [total, carritos] = await Promise.all([
            Carrito.countDocuments(),
            Carrito.find()
                .populate('user', 'name email')
                .populate('products.product', 'nameP price')
                .skip(Number(desde))
                .limit(Number(limite))
                .lean()
        ]);

        return res.status(200).json({ success: true, msg: 'Lista de carritos', total, carritos });

    } catch (error) {
        return res.status(500).json({ success: false, msg: 'Error al obtener la lista de carritos', error: error.message });
    }
};

// Actualizar el carrito
export const updateCart = async (req, res) => {
    try {
        const { name, products } = req.body;
        if (!products || products.length === 0) {
            return res.status(400).json({ success: false, msg: 'Debe proporcionar productos para actualizar el carrito' });
        }

        // Buscar usuario y carrito
        const user = await User.findOne({ name }).lean();
        if (!user) return res.status(404).json({ success: false, msg: 'Usuario no encontrado' });

        let carrito = await Carrito.findOne({ user: user._id });
        if (!carrito) return res.status(404).json({ success: false, msg: 'Carrito no encontrado' });

        // Actualizar productos en el carrito
        for (const { nameP, quantity } of products) {
            const product = await Producto.findOne({ nameP }).lean();  // Cambiado a 'Producto'
            if (!product) return res.status(404).json({ success: false, msg: `Producto ${nameP} no encontrado` });

            const productIndex = carrito.products.findIndex(item => item.product.toString() === product._id.toString());

            if (productIndex === -1) {
                return res.status(404).json({ success: false, msg: `Producto ${nameP} no está en el carrito` });
            }

            if (quantity <= 0) {
                carrito.products.splice(productIndex, 1);
            } else if (quantity > product.stock) {
                return res.status(400).json({ success: false, msg: `Stock insuficiente para ${nameP}` });
            } else {
                carrito.products[productIndex].quantity = quantity;
            }
        }

        await carrito.save();
        return res.status(200).json({ success: true, msg: 'Carrito actualizado con éxito', carrito });

    } catch (error) {
        return res.status(500).json({ success: false, msg: 'Error al actualizar el carrito', error: error.message });
    }
};

// Eliminar producto del carrito
export const deleteProincart = async (req, res) => {
    try {
        const { name, nameP } = req.body;

        // Buscar usuario y carrito
        const user = await User.findOne({ name }).lean();
        if (!user) return res.status(404).json({ success: false, msg: 'Usuario no encontrado' });

        let carrito = await Carrito.findOne({ user: user._id });
        if (!carrito) return res.status(404).json({ success: false, msg: 'Carrito no encontrado' });

        // Buscar el producto en el carrito
        const product = await Producto.findOne({ nameP }).lean();  // Cambiado a 'Producto'
        if (!product) return res.status(404).json({ success: false, msg: `Producto ${nameP} no encontrado` });

        const productIndex = carrito.products.findIndex(item => item.product.toString() === product._id.toString());

        if (productIndex === -1) {
            return res.status(404).json({ success: false, msg: `Producto ${nameP} no está en el carrito` });
        }

        // Eliminar el producto del carrito
        carrito.products.splice(productIndex, 1);
        await carrito.save();

        return res.status(200).json({ success: true, msg: `Producto ${nameP} eliminado del carrito con éxito`, carrito });

    } catch (error) {
        return res.status(500).json({ success: false, msg: 'Error al eliminar producto del carrito', error: error.message });
    }
};
