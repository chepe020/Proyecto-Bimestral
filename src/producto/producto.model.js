import { Schema, model } from "mongoose";

const productSchema = new Schema({
    nameP: {
        type: String,
        required: [true, "El nombre del producto es obligatorio"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "El precio es obligatorio"],
        min: [0, "El precio no puede ser menor que 0"]
    },
    description: {
        type: String,
        required: [true, "La descripción es obligatoria"],
        trim: true
    },
    stock: {
        type: Number,
        required: [true, "El stock es obligatorio"],
        min: [0, "El stock no puede ser menor que 0"]
    },
    sold: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Categoria",
        required: [true, "La categoría es obligatoria"]
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model("Producto", productSchema);
