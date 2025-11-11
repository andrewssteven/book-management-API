import app from "../app.js";
import request from "supertest";

describe("POST /api/v1/books", () => {
  test("respond with a 201 status code", async () => {
    const res = await request(app).post("/api/v1/books").send({
      title: "title",
      author: "author",
      genre: "genre",
      year: 2001,
    });
    expect(res.statusCode).toBe(201);
  });
});

describe("GET /api/v1/books", () => {
  test("respond with a 200 status code", async () => {
    const res = await request(app).get("/api/v1/books");
    expect(res.statusCode).toBe(200);
  });
});

describe("GET /api/v1/books/:id", () => {
  test("create a book then respond with 200 and return that book by id", async () => {
    const postRes = await request(app).post("/api/v1/books").send({
      title: "title-id",
      author: "author-id",
      genre: "genre-id",
      year: 2001,
    });
    expect(postRes.statusCode).toBe(201);

    const books = postRes.body.data;
    const created = books[books.length - 1];
    const id = created._id || created.id;

    const res = await request(app).get(`/api/v1/books/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("_id");
  });
});
