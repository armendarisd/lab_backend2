import mongoose from 'mongoose'
import PedModel from "../Pedidos/Pedidos.model.js"

const HistorialSchema = new mongoose.Schema(
    {
    Historial: {type: PedModel.schema},
    Id_Usuario: {type: mongoose.Types.ObjectId, trim: true, required: true}
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Historial", HistorialSchema, "Historial");