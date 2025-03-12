import User from "../users/user.model.js";

// Middleware para verificar si el usuario tiene uno de los roles requeridos
export const tieneRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(500).json({
                success: false,
                msg: 'Se quiere verificar un role sin validar el token primero'
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(400).json({
                success: false,
                msg: `Usuario no autorizado, posee un rol ${req.user.role}, los roles autorizados son ${roles}`
            });
        }

        next();
    };
};

// Middleware para restringir el acceso solo a administradores
export const soloAdmin = async (req, res, next) => {
    try {
        const authenticatedUserAdmin = req.user.role;

        if (authenticatedUserAdmin !== "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                msg: "Solo el ADMIN puede crear y modificar"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al modificar",
            error: error.message || error
        });
    }
};

// Middleware para restringir el acceso solo a clientes
export const soloCliente = async (req, res, next) => {
    try {
        const authenticatedUserClient = req.user.role;

        if (authenticatedUserClient !== "CLIENTE_ROLE") {
            return res.status(403).json({
                success: false,
                msg: "Solo el cliente tiene acceso",
                error: error.message || error 
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al modificar",
            error: error.message || error 
        });
    }
};


// Middleware para permitir que un usuario solo elimine su propio usuario o los administradores puedan eliminar cualquier usuario
export const eliminadoPropio = async (req, res, next) => {
    const { id } = req.params;
    const userRole = req.user.role;
    const userId = req.user.id;

    try {
        if (userRole !== "ADMIN_ROLE" && userId !== id) {
            return res.status(403).json({
                success: false,
                msg: "No puede eliminar otros usuarios que no sea el suyo"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error en la validación para eliminar",
            error: error.message || error
        });
    }
};

// Middleware para permitir que un usuario solo edite su propio perfil o los administradores puedan editar los roles de otros
export const editadoPropio = async (req, res, next) => {
    const { id } = req.params;
    const userRole = req.user.role;
    const userId = req.user.id;
    const { role } = req.body;

    try {
        // Los administradores pueden editar roles, los demás no
        if (role && userRole !== "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                msg: "Solo los administradores pueden editar el rol de otros usuarios"
            });
        }

        // Un usuario solo puede editar su propio perfil
        if (userRole !== "ADMIN_ROLE" && userId !== id) {
            return res.status(403).json({
                success: false,
                msg: "Solo puede editar su propio usuario"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error en la validación de la actualización",
            error: error.message || error
        });
    }
};
