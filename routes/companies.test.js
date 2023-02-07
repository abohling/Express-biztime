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

describe("get/ibm", function () {
  test("it returns one company info", async function () {
    const response = await request(app).get("/companies/apple");
    expect(response.body).toEqual({
      company: {
        code: "apple",
        name: "Apple",
        description: "Maker of OSX.",
        invoices: [1, 2],
      },
    });
  });
});

describe("POST /", function () {
  test("should add compnay", async function () {
    const response = await request(app)
      .post("/copmanies")
      .send({ name: "testy", description: "in depth reviews" });
    expect(response.body).toEqual({
      company: {
        code: "testy",
        name: "testy",
        description: "in depth reviews",
      },
    });
  });
});

describe("put /", function () {
  test("it should update a company", async function () {
    const response = await request(app)
      .put("/companies/apple")
      .send({ name: "new Apple", description: "brand new apple" });
    expect(response.body).toEqual({
      company: {
        code: "apple",
        name: "new Apple",
        description: "brand new apple",
      },
    });
  });
});

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
