import express from 'express'
import {GetHist, GetHistPed, CrtResPed} from "./Historial.controller.js"
import { checkauth } from '../helper/generatetoken.js';

const router = express.Router();


// ****************** GET ******************

// se obtiene el historial de todos los pedidos (token)
router.get('/', checkauth, async (req, res) => {
    const Car = await GetHist(req) // fecha inicial y final si se desea 
    res.status(200).json(Car)
});

// se obtiene el historial de un pedido  (token)
router.get('/HistPed', checkauth, async (req, res) => {
    const Car = await GetHistPed(req) // Id_Pedido
    res.status(200).json(Car)
});

router.patch('/', checkauth, async (req, res) => {
    const Car = await CrtResPed(req) // Id_Pedido, Reseña, Puntuacion
    res.status(200).json(Car)
});


export default router;