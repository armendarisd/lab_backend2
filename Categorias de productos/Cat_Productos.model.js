import mongoose from 'mongoose'

const CategoriaSchema = new mongoose.Schema(
    {
    Nombre: {type: String, trim: true, required: true, unique: true},
    Id_Usuario :{type: mongoose.Types.ObjectId, trim: true, required: true},
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Categoria", CategoriaSchema, "Categoria");