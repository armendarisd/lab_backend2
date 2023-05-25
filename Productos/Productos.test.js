import { App } from "../app";
import request from "supertest";
describe("#Productos", () => {
  function RandomWord(length) {
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  let app;
  let token = "";
  let category = "";
  let id = "";
  let user_Id = "";
  let name = "";
  beforeAll(async () => {
    app = App();
    const username = "test" + Math.random().toString(24).split(2, 7);
    category = RandomWord(10);
    name = RandomWord(10);
    await request(app)
      .post("/users/CreateUs")
      .send({
        us: username,
        email: username + "@test.com",
        pasw: "12345",
      });
    token = (
      await request(app).post("/users/login").send({
        us: username,
        pasw: "12345",
      })
    ).body;
    await request(app)
      .post("/categories/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        Cat: category,
      });
  });

  describe("POST /products/", () => {
    it("should create a product", async () => {
      const resp = await request(app)
        .post("/products/")
        .set("Authorization", `Bearer ${token}`)
        .send({
          Nombre: name,
          Precio: 1000,
          CatName: category,
        });
      expect(resp.statusCode).toBe(201);
      expect(resp.body).toBe("Producto creado con exito");
    });
  });

  describe("GET /products/", () => {
    it("should get all product", async () => {
      const resp = await request(app)
        .get("/products/")
        .set("Authorization", `Bearer ${token}`);
      expect(resp.statusCode).toBe(200);
      expect(Array.isArray(resp.body)).toBe(true);
      id = resp.body[resp.body.length - 1]._id;
      user_Id = resp.body[resp.body.length - 1].Id_Usuario;
    });
  });

  describe("GET /products/ProdUs", () => {
    it("should get all product by user id", async () => {
      const resp = await request(app)
        .get("/products/ProdUs/")
        .set("Authorization", `Bearer ${token}`)
        .send({
          _idus: user_Id,
        });
      expect(resp.statusCode).toBe(200);
      expect(Array.isArray(resp.body)).toBe(true);
      id = resp.body[resp.body.length - 1]._id;
    });
  });

  describe("GET /products/ProdUsT", () => {
    it("should get all products by token", async () => {
      const resp = await request(app)
        .get("/products/ProdUsT")
        .set("Authorization", `Bearer ${token}`);
      expect(resp.statusCode).toBe(200);
      expect(Array.isArray(resp.body)).toBe(true);
      id = resp.body[resp.body.length - 1]._id;
    });
  });

  describe("PATCH /products/", () => {
    it("should update a product", async () => {
      const newName = RandomWord(10);
      const resp = await request(app)
        .patch("/products/")
        .set("Authorization", `Bearer ${token}`)
        .send({
          _id: id,
          Nombre: newName,
        });
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toBe("se actualizo el prodcuto");
    });
  });

  describe("DELETE /produtcs/", () => {
    it("should delete a product", async () => {
      const resp = await request(app)
        .delete("/products/")
        .send({
          _id: id,
        })
        .set("Authorization", `Bearer ${token}`);
      expect(resp.statusCode).toBe(204);
    });
  });
});