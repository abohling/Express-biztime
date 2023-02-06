const request = require("supertest");

const app = require("../app");
const { createData } = require("../starter-test");
const db = require("../db");

beforeEach(createData);

afterAll(async () => {
  await db.end();
});

describe("GET /", function () {
  test("responds with array of companies", async function () {
    const response = await request(app).get("/companies");
    expect(response.body).toEqual({
      companies: [
        { code: "apple", name: "Apple" },
        { code: "ibm", name: "IBM" },
      ],
    });
  });
});

// describe("post /", function () {
//   test("", async function () {});
// });

// describe("put /", function () {
//   test("", async function () {});
// });

describe("Delete /", function () {
  test("it should delete compnay from db", async function () {
    const response = await request(app).delete("/companies/apple");
    expect(response.body).toEqual({ status: "deleted" });
    expect(response.statusCode).toBe(200);
  });

  test("it should return 404 for no comp", async function () {
    const res = await request(app).delete("/companies/notAcompany");
    expect(res.statusCode).toBe(404);
  });
});
