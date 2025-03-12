import { Router } from "express";
import { check } from "express-validator";
import {getUsers,getUserById,updateUser,deleteUser,updatePassword}from"./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js"; 
import { soloAdmin, editadoPropio, eliminadoPropio } from "../middlewares/validar-roles.js";

const router = Router();

// Obtener todos los usuarios (Solo para administradores)
router.get("/", [validarJWT, soloAdmin, validarCampos], getUsers);

// Obtener un usuario por ID
router.get(
    "/findUser/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getUserById
);

//  Actualizar usuario (Solo el usuario dueño puede modificar sus datos, pero no su rol)
router.put(
    "/:id",
    [ 
        validarJWT,
        editadoPropio, // Se valida que el usuario solo pueda editar su propia cuenta
        check("role").custom((value, { req }) => {
            if (value && value !== "CLIENTE_ROLE" && req.user.role !== "ADMIN_ROLE") {
                throw new Error("No tienes permisos para cambiar el rol.");
            }
            return true;
        }),
        validarCampos
    ],
    updateUser
);

// Eliminar usuario (Solo el dueño de la cuenta o un administrador pueden hacerlo)
router.delete(
    "/:id",
    [
        validarJWT,
        eliminadoPropio, // Permite eliminar solo si es dueño o admin
        validarCampos
    ],
    deleteUser
);

//  Actualizar contraseña (Solo el dueño de la cuenta puede hacerlo)
router.put(
    "/newpassword/:id",
    [
        validarJWT,
        editadoPropio,
        validarCampos
    ],
    updatePassword
);

export default router;
