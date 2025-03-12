import Usuario from '../users/user.model.js';
import { hash, verify } from 'argon2';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const user = await Usuario.findOne({
            $or: [{ email }, { username }]
        });

        if (!user || !user.status) {
            return res.status(400).json({
                success: false,
                msg: 'Credenciales incorrectas, Correo no existe en la base de datos o no existe en la base de datos'
            });
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                msg: 'Contraseña incorrecta'
            });
        }

        const token = await generarJWT(user.id);

        return res.status(200).json({
            success: true,
            msg: 'Ok inicio de sesión',
            userDetails: {
                username: user.username,
                token,
                profilePicture: user.profilePicture
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error en el servidor",
            error: error.message
        });
    }
};

export const register = async (req, res) => {
    try {
        const { name, lastname, username, email, password, role } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                msg: "La contraseña es obligatoria"
            });
        }

        const encryptedPassword = await hash(password);

        const user = await Usuario.create({
            name,
            lastname,
            username,
            email,
            password: encryptedPassword,
            role,
            profilePicture: req.file ? req.file.path : null  // Guarda la imagen si se subió
        });

        return res.status(201).json({
            success: true,
            msg: "Usuario registrado correctamente",
            userDetails: {
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error al registrar usuario",
            error: error.message
        });
    }
};
