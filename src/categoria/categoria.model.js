import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'], // Asegura que el campo 'name' sea obligatorio
    },
    status: {
        type: Boolean,
        default: true  // Establece el estado por defecto como 'true'
    }
});

export default model('Categoria', categorySchema);
