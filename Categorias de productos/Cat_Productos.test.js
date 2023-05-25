import { App } from "../app";
import request from "supertest";
describe("#Categorias", () => {
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
  beforeAll(async () => {
    app = App();
    const username = "test" + Math.random().toString(24).split(2, 7);
    category = RandomWord(10);
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
  });

  describe("POST /categories/", () => {
    it("should create a category", async () => {
      const resp = await request(app)
        .post("/categories/")
        .set("Authorization", `Bearer ${token}`)
        .send({
          Cat: category,
        });
      expect(resp.statusCode).toBe(201);
      expect(resp.body).toBe("Categoria creada con exito");
    });
  });

  describe("GET /categories/", () => {
    it("should get all categories", async () => {
      const resp = await request(app).get("/categories/");
      expect(resp.statusCode).toBe(200);
      expect(Array.isArray(resp.body)).toBe(true);
      id = resp.body[resp.body.length - 1]._id;
    });
  });

  describe("PATCH /categories/", () => {
    it("should update a category", async () => {
      const resp = await request(app)
        .patch("/categories/")
        .set("Authorization", `Bearer ${token}`)
        .send({
          _id: id,
          Cat: RandomWord(10),
        });
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toBe("se actualizo la categoria");
    });
  });

  describe("DELETE /categories/", () => {
    it("should delete a category", async () => {
      const resp = await request(app).delete("/categories/").send({
        Cat: category
      })
      .set("Authorization", `Bearer ${token}`);
      expect(resp.statusCode).toBe(204);
    });
  });
});