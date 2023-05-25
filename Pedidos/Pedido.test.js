import { App } from "../app";
import request from "supertest";
describe("#Carro", () => {
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
  let product;
  let category = "";
  beforeAll(async () => {
    app = App();
    const username = "test" + Math.random().toString(24).split(2, 7);
    category = RandomWord(10);

    //CREATE USER
    await request(app)
      .post("/users/CreateUs")
      .send({
        us: username,
        email: username + "@test.com",
        pasw: "12345",
      });
    //LOGIN
    token = (
      await request(app).post("/users/login").send({
        us: username,
        pasw: "12345",
      })
    ).body;
    //CREATE CATEROGY
    await request(app)
      .post("/categories/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        Cat: category,
      });

    //CREATE PRODUCT
    await request(app)
      .post("/products/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        Nombre: RandomWord(15),
        Precio: 1000,
        CatName: category,
      });
    const products = (
      await request(app)
        .get("/products/")
        .set("Authorization", `Bearer ${token}`)
    ).body;
    product = products[products.length - 1];
    console.log(product)
  });

  describe("POST /Ped/", () => {
    it("should create ped", async () => {
      const resp = await request(app)
        .post("/Ped/")
        .set("Authorization", `Bearer ${token}`)
        .send({
          idprod: product._id,
          cant: 1,
        });
      expect(resp.statusCode).toBe(201);
      expect(resp.body).toBe("pedido creado con exito");
    });
  });

  describe("GET /Ped/", () => {
    it("get records", async () => {
      const resp = await request(app)
        .get("/Ped/")
        .set("Authorization", `Bearer ${token}`);
      expect(resp.statusCode).toBe(200);
      expect(Array.isArray(resp.body)).toBe(true);
    });
  });

  describe("PATCH /Ped/", () => {
    it("should update a car", async () => {
      
    });
  });

  describe("DELETE /Ped/", () => {
    it("should delete a car", async () => {
      const resp = await request(app)
        .delete("/Ped/")
        .set("Authorization", `Bearer ${token}`);
      expect(resp.statusCode).toBe(204);
    });
  });
});