import { Router } from "express";
import { check } from "express-validator";
import { saveCart, getCart, updateCart, deleteProincart } from "./carito.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { existeCarrito } from "../helpers/db-validator.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { soloCliente } from "../middlewares/validar-roles.js";

const router = Router();

// Agregar productos al carrito
router.post(
    "/",
    [
        validarJWT,
        soloCliente,
        validarCampos
    ],
    saveCart
);

// Obtener el carrito del usuario


router.get(
    "/",
    [
        validarJWT,
        soloCliente
    ],
    getCart
);

// Actualizar productos en el carrito
router.put(
    "/:id",
    [
        validarJWT,
        soloCliente,
        check("id", "ID de carrito inválido").isMongoId(),
        check("id").custom(existeCarrito),
        validarCampos
    ],
    updateCart
);

// Eliminar un producto del carrito
router.delete(
    "/:id/:productId",
    [
        validarJWT,
        soloCliente,
        check("id", "ID de carrito inválido").isMongoId(),
        check("productId", "ID de producto inválido").isMongoId(),
        validarCampos
    ],
    deleteProincart
);

export default router;
