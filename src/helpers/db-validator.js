import Role from '../role/role.model.js';
import User from '../users/user.model.js';
import Category from '../categoria/categoria.model.js';
import Product from '../producto/producto.model.js';
import Carrito from '../carrito/carito.model.js';
import Factura from '../factura/factura.model.js';

// Validar si el rol existe en la base de datos
export const esRoleValido = async (role = '') => {
    const existeRol = await Role.findOne({ role });

    if (!existeRol) {
        throw new Error(`El rol ${role} no existe en la base de datos.`);
    }
};

// Verificar si el correo ya existe en la base de datos
export const existenteEmail = async (correo = '') => {
    const existeEmail = await User.findOne({ correo });

    if (existeEmail) {
        throw new Error(`El correo ${correo} ya está registrado en la base de datos.`);
    }
};

// Verificar si un usuario existe por su ID
export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);
    
    if (!existeUsuario) {
        throw new Error(`El usuario con el ID ${id} no existe.`);
    }
};

// Verificar si la categoría existe por su ID
export const existeCategory = async (id = '') => {
    const existeCategory = await Category.findById(id);
    
    if (!existeCategory) {
        throw new Error(`La categoría con el ID ${id} no existe.`);
    }
};

// Verificar si el producto existe por su ID
export const existeProduct = async (id = '') => {
    const existeProduct = await Product.findById(id);
    
    if (!existeProduct) {
        throw new Error(`El producto con el ID ${id} no existe.`);
    }
};

// Verificar si el carrito existe por su ID
export const existeCarrito = async (id = '') => {
    const existeCarrito = await Carrito.findById(id);
    
    if (!existeCarrito) {
        throw new Error(`El carrito con el ID ${id} no existe.`);
    }
};

// Verificar si la factura existe por su ID
export const existeFactura = async (id = '') => {
    const existeFactura = await Factura.findById(id);
    
    if (!existeFactura) {
        throw new Error(`La factura con el ID ${id} no existe.`);
    }
};
