import { Schema, model } from "mongoose";

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
    },
    lastname: {
        type: String,
        required: [true, "El apellido es obligatorio"],
    },
    username: {
        type: String,
        required: [true, "El nombre de usuario es obligatorio"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "El correo electrónico es obligatorio"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"]
    },
    role: {
        type: String,
        enum: ['ADMIN_ROLE', 'CLIENTE_ROLE'],
        default: 'CLIENTE_ROLE'
    },
    status: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true,  // Agrega createdAt y updatedAt automáticamente
    versionKey: false  // Elimina el campo __v de Mongoose
});

UserSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model('User', UserSchema);