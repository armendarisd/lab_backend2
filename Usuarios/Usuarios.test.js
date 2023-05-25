import { App } from "../app";
import request from "supertest";

describe("#Usuarios", () => {
    let app;
    let createdUserToken = -1;
    let username = "";
    beforeAll(async () => {
        app =  App();
        username = "test" + Math.random().toString(24).split(2, 7);
    })

    describe("POST /users/", () => {
        it("should create an user", async () => {
            const resp = await request(app).post("/users/CreateUs").send({
                us: username, 
                email: username + "@test.com",
                pasw: "12345",
            });
            expect(resp.statusCode).toBe(201);
            expect(resp.body).toBe("Usuario creado con exito");
        });
    });

    describe("GET /users/", () => {
        it("should get all users", async () => {
            const resp = await request(app).get("/users/");
            expect(resp.statusCode).toBe(200);
            expect(resp.body.length).toBeGreaterThan(0);
        });
    });

    describe("POST /users/login", () => {
        it("should return error if user is invalid", async () => {
            const resp = await request(app).post("/users/login").send({
                us: "invalidUser", 
                pasw: "12345",
            });
            expect(resp.statusCode).toBe(200);
            expect(resp.body).toBe("usuario o contraseña incorrectos");
        });
        it("should return error if password is invalid", async () => {
            const resp = await request(app).post("/users/login").send({
                us: username, 
                pasw: "invalidpass",
            });
            expect(resp.statusCode).toBe(200);
            expect(resp.body).toBe("usuario o contraseña incorrectos");
        });
        it("should login an user", async () => {
            const resp = await request(app).post("/users/login").send({
                us: username, 
                pasw: "12345",
            });
            expect(resp.statusCode).toBe(200);
            expect(resp.body).not.toBe(undefined);
            createdUserToken = resp.body;
        });
    });

    describe("POST /users/loginT", () => {
        it("should return error if token is invalid", async () => {
            const resp = await request(app).post("/users/login").set('Authorization', `Bearer ${"eyasdaa8sdasjdn"}`);
            expect(resp.statusCode).toBe(200);
            expect(resp.body).toBe("usuario o contraseña incorrectos");
        });
        it("should login an with token", async () => {
            const resp = await request(app).post("/users/login").set('Authorization', `Bearer ${createdUserToken}`);
            expect(resp.statusCode).toBe(200);
            expect(resp.body).not.toBe(undefined);
        });
        
    });

   

    describe("GET /users/Logus", () => {
        it("should return error if user not found", async () => {
            const resp = await request(app).get("/users/logus").set('Authorization', `Bearer ${"eyasd"}`);
            expect(resp.statusCode).toBe(409);
            expect(resp.body).toBe("token no valido");
        });
        it("should get an user by token", async () => {
            const resp = await request(app).get("/users/logus").set('Authorization', `Bearer ${createdUserToken}`);
            expect(resp.statusCode).toBe(200);
            expect(resp.body.Usuario).toBe(username);
            expect(resp.body.Correo).toBe(username+"@test.com");
            expect(resp.body.Contraseña).toBe("12345");
        });
    });

    describe("PATCH /users/:id", () => {
        it("should update an user", async () => {
            username = "test" + Math.random().toString(24).split(2, 7);
            const resp = await request(app).patch("/users/")
            .set('Authorization', `Bearer ${createdUserToken}`)    
            .send({
                us: username, 
                email: username + "@test.com",
                pasw: "123456",
            });
            expect(resp.statusCode).toBe(200);
            expect(resp.body).toBe("se actualizo el usuario");
        });
    });


    describe("DELETE /users/:id", () => {
        it("should delete an user", async () => {
            const resp = await request(app).delete("/users/").set('Authorization', `Bearer ${createdUserToken}`);
            expect(resp.statusCode).toBe(204);
        });
    });

    


})