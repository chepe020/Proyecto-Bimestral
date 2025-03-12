import { Router } from "express";
import { saveFactura, getFactura } from "./factura.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { soloCliente } from "../middlewares/validar-roles.js";

const router = Router();

// Ruta para guardar una factura
router.post(
    "/",
    [
        validarJWT,          // Verifica que el usuario esté autenticado
        soloCliente,         // Verifica que el usuario sea cliente
        validarCampos        // Valida los campos del request
    ],
    saveFactura            // Controlador para procesar la factura
);

// Ruta para obtener las facturas de un usuario
router.get(
    "/",
    [
        validarJWT,          // Verifica que el usuario esté autenticado
        soloCliente          // Verifica que el usuario sea cliente
    ],
    getFactura             // Controlador para obtener las facturas
);

export default router;
