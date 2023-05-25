import mongoose from 'mongoose'

const ProductoSchema = new mongoose.Schema(
    {
    Nombre: {type: String, trim: true, required: true},
    Precio: {type: Number, trim: true, required: true},
    Id_Categoria : {type: mongoose.Types.ObjectId, trim: true, required: true},
    Id_Usuario:  {type: mongoose.Types.ObjectId, trim: true, required: true}
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Producto", ProductoSchema, "Producto");