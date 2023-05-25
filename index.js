import http from 'http';
import {App} from './app.js'
const app = App()

const server = http.createServer(app);


// ABRIR PUERTO PARA APP
server.listen(3000, (err) => {
    if(err){
        console.log("Error", err)
        return
    }
    console.log("Server listening on port 3000")
});

