const request = require("supertest");
const app = require("../index");

describe("Test the root path", () => {
  jest.setTimeout(30000);
  test("It should response the GET method", (done) => {
    request(app)
      .get("/api/project/all")
      .then((response) => {
        console.log("CHECK RESPONSE", response);
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
