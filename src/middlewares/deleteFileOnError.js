import fs from 'fs/promises';
import { join } from 'path';

export const deleteFileOnError = async (err, req, res, next) => {
    // Verificar si se debe eliminar el archivo y manejar el error de eliminación
    if (req.file && req.filePath) {
        const filePath = join(req.filePath, req.file.filename);
        try {
            await fs.unlink(filePath);
        } catch (unlinkErr) {
            console.error('Error deleting file:', unlinkErr);
        }
    }

    // Manejo de errores específicos
    if (err.status === 400 || err.errors) {
        return res.status(400).json({
            success: false,
            errors: err.errors || 'Bad request error'
        });
    }

    // Si no es un error 400, enviamos un error 500
    return res.status(500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
};
