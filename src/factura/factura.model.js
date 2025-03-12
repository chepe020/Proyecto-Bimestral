import { Schema, model } from "mongoose";

const facturaSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Asegúrate de que la referencia esté en mayúscula si tu modelo de usuario se llama 'User'
        required: true
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product', // Asegúrate de que la referencia esté en mayúscula si tu modelo de producto se llama 'Product'
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'La cantidad debe ser al menos 1'] // Aseguramos que la cantidad sea válida
        },
        price: {
            type: Number,
            required: true,
            min: [0, 'El precio no puede ser negativo'] // Validación de precio
        }
    }],
    total: {
        type: Number,
        required: true,
        min: [0, 'El total no puede ser negativo'] // Validación del total
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Añade automáticamente createdAt y updatedAt
});

export default model('Factura', facturaSchema);

