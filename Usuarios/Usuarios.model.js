import mongoose from 'mongoose'

const UsuariosSchema = new mongoose.Schema(
    {
    Usuario: {type: String, trim: true, required: true, unique: true},
    Correo: {type: String, trim: true, required: true, unique: true},
    Contraseña: {type: String, trim: true, required: true},
    },
    {
    timestamps: true,
    }
);

export default mongoose.model("Usuarios", UsuariosSchema, "Usuarios");