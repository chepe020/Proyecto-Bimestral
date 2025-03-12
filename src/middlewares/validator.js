import { body } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { existenteEmail, esRoleValido } from "../helpers/db-validator.js";

// Validador para el registro de usuario
export const registerValidator = [
    body("name", "El nombre es obligatorio").not().isEmpty(),
    body("lastname", "El apellido es obligatorio").not().isEmpty(),
    body("email", "Debes ingresar un correo electrónico válido").isEmail(),
    body("email").custom(existenteEmail), // Verificación de si el email ya existe en la base de datos
    body("role").optional().custom(esRoleValido), // Validación opcional del rol, solo si se incluye
    body("password", "La contraseña debe tener al menos 8 caracteres").isLength({ min: 8 }), // Verificación de la longitud de la contraseña
    validarCampos, // Middleware para validar los campos
];

// Validador para el inicio de sesión
export const loginValidator = [
    body("email")
        .optional()
        .isEmail()
        .withMessage("Ingresa una dirección de correo válida"), // Validación opcional para el email
    body("username")
        .optional()
        .isString()
        .withMessage("Ingresa un nombre de usuario válido"), // Validación opcional para el nombre de usuario
    body("password", "La contraseña debe tener al menos 8 caracteres").isLength({ min: 8 }), // Verificación de la longitud de la contraseña
    validarCampos, // Middleware para validar los campos
];