import { Schema, model } from "mongoose";

const cartSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Referencia al modelo de usuario
        required: [true, 'El usuario es obligatorio']
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',  // Referencia al modelo de producto
            required: [true, 'El producto es obligatorio']
        },
        quantity: {
            type: Number,
            required: [true, 'La cantidad es obligatoria'],
            min: [1, 'La cantidad debe ser al menos 1']
        }
    }]
}, { timestamps: true });  // Añadido para manejar automáticamente la creación y actualización de fechas

export default model('Carrito', cartSchema);
