import express from 'express'
import {createUser, getUsers, logIn, getUserslog, ActUs, DelUs, logInT} from "./Usuarios.controller.js"
import { checkauth } from '../helper/generatetoken.js';

const router = express.Router();


// ****************** GET ******************


// Mostrar todos los Usuarios
router.get('/', async (req, res) => {
    const users = await getUsers()
    res.status(200).json(users)
});


// Mostrar el usuario de la sesion con token 
router.get('/Logus', checkauth, async (req, res) => {
    const users = await getUserslog(req)
    res.status(200).json(users)
});


// ****************** POST ******************

// crear un usuario (registro)
router.post('/CreateUs', async (req, res) => {
    const data = await createUser(req.body, res)
    res.status(201).json(data)
});

// Iniciar sesion y devuelve el token del usuario con correo y contraseña 
router.post('/login', async (req, res) => {
    const Token = await logIn(req.body, res)
    res.status(200).json(Token)
});

// Iniciar sesion con token
router.post('/loginT',checkauth, async (req, res) => {
    const Token = await logInT(req)
    res.status(200).json(Token)
});


// ****************** PATCH ******************


// Actualizar usuario (token)
router.patch('/', checkauth, async (req, res)=> {
    const us = await ActUs(req, res) // Usuario, Correo, Contraseña
    res.status(200).json(us)
});


// ****************** DELETE ******************


// Borrar un usuario (token)
router.delete('/',checkauth, async (req, res)=> {
    const us = await DelUs(req, res)
    res.status(204).json(us)
});

export default router;
