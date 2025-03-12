import jwt from 'jsonwebtoken';
import User from '../users/user.model.js';

// Middleware para validar el JWT
export const validarJWT = async (req, res, next) => {

    // Obtener el token del encabezado "x-token"
    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({
            msg: "No hay token en la petición"
        });
    }

    try {
        // Verificar el token y obtener el uid
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // Buscar el usuario por su uid
        const user = await User.findById(uid);

        // Verificar si el usuario existe
        if (!user) {
            return res.status(401).json({
                msg: 'Usuario no existe en la base de datos'
            });
        }

        // Verificar si el usuario está activo
        if (!user.status) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado: false'
            });
        }

        // Guardar el usuario en la solicitud para usarlo en los siguientes middlewares o rutas
        req.user = user;

        next();
    } catch (e) {
        console.log(e);
        res.status(401).json({
            msg: "Token no válido"
        });
    }
};
