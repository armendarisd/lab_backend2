import mongoose from 'mongoose'
//Productos: [{id_prod: {Type: mongoose.Types.ObjectId, trim: true}, Producto: {Type: String, trim: true}, Precio: {Type: Number, trim: true}, cantidad:{Type: Number, trim: true}}],
const PedSchema = new mongoose.Schema(
    {
    Producto: {id_prod: mongoose.Types.ObjectId, Producto: String, Precio: Number, cantidad: Number},
    Total: {type: Number, required: true},
    Id_Usuario: {type: mongoose.Types.ObjectId, trim: true, required: true},
    Reseña: {type: String, trim: true, required: false, default: ""},
    Puntuacion : {type: Number, trim: true, required: false, default: 0},
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Pedidos", PedSchema, "Pedidos");