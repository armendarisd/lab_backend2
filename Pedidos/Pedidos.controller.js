import PedModel from "./Pedidos.model.js";
import ProdModel from "../Productos/Productos.model.js"
import HistModel from "../Historial/Historial.model.js"
import {Verifytoken} from "../helper/generatetoken.js"
import mongoose from 'mongoose'

// obtener pedido actual usuario log (token) // se obtiene antes de pagar, una vez pagado no se obtendra ningun pedido
export async function GetPed(req) {
    const token = req.headers.authorization.split(' ').pop()
    const tokendata = await Verifytoken(token) 
    const Ped = await PedModel.aggregate([ // se puede usar _id del pedido ambos son unicos dentro del modelo
        {$match: {"Id_Usuario": mongoose.Types.ObjectId(tokendata._id)}},
        {$project: { _id: 0, Id_Usuario:0, createdAt: 0 , updatedAt:0, __v:0, Productos: {_id:0, id_prod:0} }},
    ])
    return Ped
}

//se crea el pedido (token)
export async function AddPed(req) {
    const token = req.headers.authorization.split(' ').pop()
    const tokendata = await Verifytoken(token)
    const prod = await SerchProd(req.body.idprod)
    const prodm = new PedModel({  
        Producto: {id_prod: prod._id, Producto: prod.Nombre, Precio: prod.Precio, cantidad: req.body.cant},
        Total: (prod.Precio * req.body.cant),
        Id_Usuario: tokendata._id,
    });
    await prodm.save()
    return ("pedido creado con exito")
}

// se realiza/paga el pedido, se agrega al historia / se elimina el pedido actual (token)
export async function CompPed(req) {
    const token = req.headers.authorization.split(' ').pop()
    const tokendata = await Verifytoken(token)
    const Ped = await PedModel.find({Id_Usuario: tokendata._id}) // se puede usar _id del pedido, ambos son unicos dentro del modelo
    if (Ped){
            const Hist = new HistModel(
                {  
                Historial: Ped[0],
                Id_Usuario: tokendata._id
                }
                );
            await Hist.save()
            await DelPed(req)
            return ("Pedido comprado con exito")   
        }else{
        return ("No hay productos a comprar")
        }
    
}

// se elimina el pedido (token)
export async function DelPed(req) {
    const token = req.headers.authorization.split(' ').pop()
    const tokendata = await Verifytoken(token)
    const Prod = await PedModel.findOneAndDelete({Id_Usuario: tokendata._id})
    return ("se elimino el pedido con exito")
}


// funciones internas 

// busca un producto
async function SerchProd (id){
    const Prod = await ProdModel.findById(id)
    return Prod
}