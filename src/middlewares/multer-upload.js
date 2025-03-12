import multer from "multer";
import { dirname, extname, join } from "path";
import { fileURLToPath } from "url";

// Obtener el directorio actual del archivo
const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

// Tipos de mimetypes permitidos
const MIMETYPES = ["image/jpeg", "image/png", "image/jpg"];

// Tamaño máximo permitido para archivos (10MB)
const MAX_SIZE = 10000000;

// Función para crear configuración de Multer
const createMulterConfig = (destinationPath) => {
    return multer({
        storage: multer.diskStorage({
            // Especificar el destino del archivo
            destination: (req, file, cb) => {
                const fullPath = join(CURRENT_DIR, destinationPath);
                req.filePath = fullPath; // Guardar la ruta del archivo en el request
                cb(null, fullPath);
            },
            // Establecer el nombre del archivo
            filename: (req, file, cb) => {
                const fileExtension = extname(file.originalname);
                const fileName = file.originalname.split(fileExtension)[0];
                cb(null, `${fileName}-${Date.now()}${fileExtension}`);
            }
        }),
        // Filtrar los archivos según el mimetype
        fileFilter: (req, file, cb) => {
            if (MIMETYPES.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error(`Only ${MIMETYPES.join(", ")} mimetypes are allowed`));
            }
        },
        // Limitar el tamaño del archivo
        limits: {
            fileSize: MAX_SIZE
        }
    });
};

// Exportar configuraciones específicas para imágenes de perfil y mascotas
export const uploadProfilePicture = createMulterConfig("../public/uploads/profile-pictures");
export const uploadPetPicture = createMulterConfig("../public/uploads/pet-pictures");
