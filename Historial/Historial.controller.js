import mongoose from "mongoose"
import { Verifytoken } from "../helper/generatetoken.js"
import HistModel from "../Historial/Historial.model.js"

// obtener el historial (token)
export async function GetHist(req) {
    const token = req.headers.authorization.split(' ').pop()
    const tokendata = await Verifytoken(token)
    let query = {"Id_Usuario": mongoose.Types.ObjectId(tokendata._id)};
    if (req.body.fi) {
        query.createdAt = { $gte: req.body.fi, $lt:req.body.ff }; // fecha inicial y final 
    }   
    const Res = await HistModel.aggregate([
        {$match: query},
        {$project: {Historial: { _id: 0, Id_Usuario:0, createdAt: 0 , updatedAt:0, __v:0, Productos: {_id:0, id_prod:0}}}},
        {$project: { _id: 0, Id_Usuario: 0, createdAt: 0, updatedAt:0, __v:0 }},  
    ])
    //se muestran de mayor puntuacion a menor puntuacion
    const aca = Res.map(x => x.Historial).sort((p1, p2) => (p1.Puntuacion < p2.Puntuacion) ? 1 : ((p1.Puntuacion > p2.Puntuacion)) ? -1 : 0)
    return aca
}

// obtener el historial de un pedido (token)
export async function GetHistPed(req) {
    const token = req.headers.authorization.split(' ').pop()
    const tokendata = await Verifytoken(token)
    const Res = await HistModel.aggregate([
        {$match: {"Id_Usuario": mongoose.Types.ObjectId(tokendata._id)}},
        {$project: {Historial: { Id_Usuario:0, createdAt: 0 , updatedAt:0, __v:0, Productos: {_id:0, id_prod:0}}}},
        {$project: { _id: 0, Id_Usuario: 0, createdAt: 0, updatedAt:0, __v:0 }}, 
        {$match: {"Historial._id": mongoose.Types.ObjectId(req.body.id)}}, //id del pedido
        {$project: {Historial:{_id: 0}}},
    ])  
    return aca
}


// actualiza la reseña y la puntuacion de un pedido (token) 
export async function CrtResPed(req) {
    const token = req.headers.authorization.split(' ').pop()
    const tokendata = await Verifytoken(token)
    const Res = await HistModel.findOneAndUpdate({
            Id_Usuario: mongoose.Types.ObjectId(tokendata._id),"Historial._id": mongoose.Types.ObjectId(req.body.id)}, // id del pedido
            {$set: {"Historial.Reseña": req.body.res, "Historial.Puntuacion": req.body.punt}}) // reseña y puntuacion
            .select("Historial -_id");
    return ("Reseña y puntuacion actualizado con exito")
}