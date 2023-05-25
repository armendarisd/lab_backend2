import express from 'express'
import {GetPed, AddPed, CompPed, DelPed} from "./Pedidos.controller.js"
import { checkauth } from '../helper/generatetoken.js';

const router = express.Router();


// ****************** GET ******************

// se obtiene el pedido actual si no se ha realizado el patch/pago
router.get('/',checkauth, async (req, res) => {
    const Ped = await GetPed(req)
    res.status(200).json(Ped)
});


// ****************** POST ******************

// Se crea un pedido
router.post('/',checkauth, async (req, res) => {
    const Ped = await AddPed(req) // Id_Producto, Cantidad
    res.status(201).json(Ped)
});

// ****************** PATCH ******************

// Compra pedido / agregar historial de compra / eliminar pedido actual
router.patch('/',checkauth, async (req, res) => {
    const Ped = await CompPed(req)
    res.status(200).json(Ped)
});


// ****************** DELETE ******************

// se elimina el pedido actual
router.delete('/',checkauth, async (req, res) => {
    const Ped = await DelPed(req)
    res.status(204).json(Ped)
});

export default router;