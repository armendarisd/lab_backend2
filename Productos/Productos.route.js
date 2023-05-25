import express from 'express'
import {CreateProduct, ProdAll, ProdUs, ProdUsT, ProdIn, ProdNom, ProdCat, ActProd, DelProd} from "./Productos.controller.js"
import { checkauth } from '../helper/generatetoken.js';
const router = express.Router();


// ****************** GET ******************


// Mostrar todos los productos
router.get('/', async (req, res) => {
    const Prod = await ProdAll() //
    res.status(200).json(Prod)
});


// Mostrar productos de un usuario 
router.get('/ProdUs', async (req, res) => {
    const Prod = await ProdUs(req.body) // _id_usuario
    res.status(200).json(Prod)
});

// Mostrar productos de un usuario (sesion token) 
router.get('/ProdUsT', checkauth, async (req, res) => {
    const Prod = await ProdUsT(req) // _id_usuario (token)
    res.status(200).json(Prod)
});


// Mostrar producto individual  
router.get('/ProdIn', async (req, res) => {
    const Prod = await ProdIn(req.body) // _id_producto
    res.status(200).json(Prod)
});


// Mostrar producto segun nombre  
router.get('/ProdName', async (req, res) => {
    const Prod = await ProdNom(req.body) // Nombre Producto
    res.status(200).json(Prod)
});


// Mostrar producto segun categoria 
router.get('/ProdCat', async (req, res) => {
    const Prod = await ProdCat(req.body) // Nombre Categoria
    res.status(200).json(Prod)
});



// ****************** POST ******************


// Crear un producto (token)
router.post('/', checkauth , async (req, res)=> {
    const Prod = await CreateProduct(req) // Nombre categoria, Nombre producto y Precio producto
    res.status(201).json(Prod)
});



// ****************** PATCH ******************


// Actualiza el producto (token)
router.patch('/',checkauth, async (req, res)=> {
    const Prod = await ActProd(req) // Id_Producto, Nombre categoria, Nombre producto y Precio producto
    res.status(200).json(Prod)
});



// ****************** DELETE ******************


// Borrar un producto (token)
router.delete('/',checkauth, async (req, res)=> {
    const Prod = await DelProd(req) // _id_producto
    res.status(204).json(Prod)
});


export default router;