import { App } from "../app";
import request from "supertest";
describe("#Historial", () => {
  let app;
  let token = "";
  beforeAll(async () => {
    app = App();
    const username = "test" + Math.random().toString(24).split(2, 7);
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

  describe("GET /records/", () => {
    it("get records", async () => {
      const resp = await request(app)
        .get("/records/")
        .set("Authorization", `Bearer ${token}`);
      expect(resp.statusCode).toBe(200);
    });
  });
});