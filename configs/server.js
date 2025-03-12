'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/users/user.routes.js';
import categoryRoutes from '../src/categoria/categoria.routes.js';
import productRoutes from '../src/producto/producto.routes.js';
import cartRoutes from '../src/carrito/carito.routes.js';
import facturaRoutes from '../src/factura/factura.routes.js';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
};

const routes = (app) => {
    app.use("/Proyecto-Bimestral/v1/auth", authRoutes);
    app.use("/Proyecto-Bimestral/v1/users", userRoutes);
    app.use("/Proyecto-Bimestral/v1/categoria", categoryRoutes);
    app.use("/Proyecto-Bimestral/v1/producto", productRoutes);
    app.use("/Proyecto-Bimestral/v1/carrito", cartRoutes);
    app.use("/Proyecto-Bimestral/v1/factura", facturaRoutes);
};

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log("Conexión a la base de datos exitosa");
    } catch (error) {
        console.error("Error conectando a la base de datos:", error);
        process.exit(1);
    }
};

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        await conectarDB();  // Esperar conexión a la base de datos antes de continuar
        routes(app);
        
        app.listen(port, () => {
            console.log(`Servidor corriendo en el puerto: ${port}`);
        });

    } catch (error) {
        console.error("Error iniciando el servidor:", error);
    }
};
