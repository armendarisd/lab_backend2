import express from 'express';
import mongoose from 'mongoose';
import {} from 'dotenv/config'
import userRoutes from './Usuarios/Usuarios.route.js'; 
import CatRoutes from './Categorias de productos/Cat_Productos.route.js'; 
import ProdRoutes from './Productos/Productos.route.js';
import HistRoute from './Historial/Historial.route.js'
import PedRoute from './Pedidos/Pedidos.route.js'



const [user,pasw] = [process.env.DB_USER, process.env.PASW]


export function TestApp() {

    console.log(user +  " " + pasw)

    // MIDDLEWARE JSON
    const app = express();

    app.use(express.json())

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', '*');

        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }
        next();
    });

    // rutas
    app.use('/users', userRoutes) // Usuarios
    app.use('/products', ProdRoutes) // Productos
    app.use('/categories', CatRoutes) // Categorias
    app.use('/records', HistRoute) // Historial
    app.use('/Ped', PedRoute) // Pedidos

    app.use(async (req, res) => {
        res.status(404).json({message: "Not found."})
    });
    return app
}


export function App() {
    const app = TestApp()

    // CONEXION MONGO
    mongoose.connect(
        "mongodb+srv://"+user+":"+pasw+"@labbackend.wsxmbzf.mongodb.net/Amazon?retryWrites=true&w=majority")
        //"mongodb+srv://"+user+":"+pasw+"pn@labbackend.wsxmbzf.mongodb.net/Amazon?retryWrites=true&w=majority")
    .then(() => {
        console.log("Conectado a la base de datos");
    })
    .catch((e) => {
        console.log(e)
        console.log("Error de conexion")
    })

    return app
}
