import { Router } from "express";
import { check } from "express-validator";
import {saveProduct,getProduct,deleteProduct,updateProduct,getProductById,getStockA,buscarPorNombre,listSales} from "./producto.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { existeProduct } from "../helpers/db-validator.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { soloAdmin } from "../middlewares/validar-roles.js";

const router = Router();

// Crear producto (Solo Admin)
router.post(
    "/",
    [
        validarJWT,
        soloAdmin,
        validarCampos
    ],
    saveProduct
);

// Obtener todos los productos
router.get("/", getProduct);

// Eliminar producto (Solo Admin)
router.delete(
    "/:id",
    [
        validarJWT,
        soloAdmin,
        check("id", "ID no válido").isMongoId(),
        check("id").custom(existeProduct),
        validarCampos
    ],
    deleteProduct
);

// Actualizar producto (Solo Admin)
router.put(
    "/:id",
    [
        validarJWT,
        soloAdmin,
        check("id", "ID no válido").isMongoId(),
        check("id").custom(existeProduct),
        validarCampos
    ],
    updateProduct
);

// Obtener producto por ID (Ahora requiere validación de JWT)
router.get(
    "/findProduct/:id",
    [
        validarJWT,
        check("id", "ID no válido").isMongoId(),
        check("id").custom(existeProduct),
        validarCampos
    ],
    getProductById
);

// Obtener stock de productos (Eliminada validación incorrecta de `id`)
router.get("/stock", validarJWT, getStockA);

// Buscar producto por nombre
router.get("/buscar", validarJWT, buscarPorNombre);

// Obtener listado de ventas
router.get("/ventas", validarJWT, soloAdmin, listSales);

export default router;
