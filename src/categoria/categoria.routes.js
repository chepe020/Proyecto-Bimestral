import { Router } from "express";
import { check } from "express-validator";
import { saveCategory, getCategory, updateCategory, deleteCategory } from "./categoria.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { existeCategory } from "../helpers/db-validator.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { soloAdmin } from "../middlewares/validar-roles.js";

const router = Router();

// Ruta para crear una categoría
router.post(    
    "/",
    [
        validarJWT,
        soloAdmin,
        check("name", "El nombre es obligatorio").not().isEmpty(),
        validarCampos
    ],
    saveCategory
);

// Ruta para obtener categorías
router.get("/", getCategory);

// Ruta para eliminar una categoría
router.delete(
    "/:id",
    [
        validarJWT,
        soloAdmin,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeCategory),
        validarCampos
    ],
    deleteCategory
);

// Ruta para actualizar una categoría
router.put(
    "/:id",
    [
        validarJWT,
        soloAdmin,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeCategory),
        check("name", "El nombre es obligatorio").not().isEmpty(),
        validarCampos
    ],
    updateCategory
);

export default router;
