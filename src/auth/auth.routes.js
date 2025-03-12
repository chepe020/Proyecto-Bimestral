import { Router } from 'express';
import { login, register } from './auth.controller.js';
import { registerValidator, loginValidator } from '../middlewares/validator.js';
import { uploadProfilePicture } from '../middlewares/multer-upload.js';
import { deleteFileOnError } from '../middlewares/deleteFileOnError.js';

const router = Router();

// Login de usuario
router.post('/login', loginValidator, login);

// Registro de usuario con validación antes de subir la imagen
router.post(
    '/register',
    registerValidator, // Primero validamos los datos
    uploadProfilePicture.single("profilePicture"), // Luego subimos la imagen si es válido
    deleteFileOnError, // Si hay error después de la carga, eliminamos el archivo
    register
);

export default router;
