import { afterAll, beforeAll, expect } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";

dotenv.config({path:".env.test"})

let mongoServer;

const connectdb = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("database connected successfully");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await connectdb(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Integration test: Test all auth endpoints", () => {

    // Test: create new user
  test("Test 1: register new user new user POST api/v1/auth/register", async () => {
    const payload = {
      name: "john doe",
      email: "example@gmail.com",
      password: "myPassword",
    };
    const res = await request(app)
    .post("/api/v1/auth/register")
    .send(payload);
    expect(res.statusCode).toBe(201);

    console.log(res.body);
    global.userId = res.body.data[0]._id
  });

    // Test: User login
  test("Test 2: existing user login POST api/v1/auth/login", async () => {
    const payload = {
        email: "example@gmail.com",
        password: "myPassword"
    }
        
    const res = await request(app)
    .post("/api/v1/auth/login/")
    .send(payload)
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("message", "login successfull")
    expect(res.body).toHaveProperty("status", "success")
    console.log(res.body.message);
  }) 
  

});
 
describe("Integration test: Test all users endpoints", () => {
       
    // Test: get all available users   
  test("Test 1: get all available users GET api/v1/users", async () => {
    const token = jwt.sign(
            {
                id: 123, 
                name:"test User", 
                role:"admin"
            }, process.env.ACCESS_TOKEN_SECRET )

    const res = await request(app)
    .get("/api/v1/users/")
    .set("Authorization", `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    console.log(res.body);
  })

//   Test: get user by id
  test("Test 2: get user by Id GET api/v1/users/:id", async () => {
     const token = jwt.sign(
            {
                id: 123, 
                name:"test User", 
                role:"admin"
            }, process.env.ACCESS_TOKEN_SECRET )

    const res = await request(app)
    .get(`/api/v1/users/${global.userId}`)
    .set("Authorization", `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    console.log(res.body)
  })

//   Test: update user
  test("Test 3: update user information PUT api/v1/users/:id", async () => {
    const payload = {
        password: "newPassword"
    }
    const token = jwt.sign(
            {
                id: 123, 
                name:"test User", 
                role:"admin"
            }, process.env.ACCESS_TOKEN_SECRET )
    
    const res = await request(app)
    .put(`/api/v1/users/${global.userId}`)
    .set("Authorization", `Bearer ${token}`)
    .send(payload)
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toMatch("success")
  })

//   Test: delete user
  test("Test 4: delete user information DELETE api/v1/users/:id", async () => {

    const token = jwt.sign(
            {
                id: 123, 
                name:"test User", 
                role:"admin"
            }, process.env.ACCESS_TOKEN_SECRET )

    const res = await request(app)
    .delete(`/api/v1/users/${global.userId}`)
    .set("Authorization", `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    console.log(res.body.message);
  })

})

describe("Integration test: Test all books enpoint", ()=> {
    // Test: create new book endpoint
    test("Test 1: create new book POST api/v1/books", async () => {
        const payload = {
            title: "lord of the rings",
            author: "J.k rowlings",
            year: "1970",
            genre: "mystical fiction"
        }
        const token = jwt.sign(
            {
                id: 123, 
                name:"test User", 
                role:"admin"
            }, process.env.ACCESS_TOKEN_SECRET )

        const res = await request(app)
        .post("/api/v1/books")
        .set("Authorization", `Bearer ${token}`)
        .send(payload)
        expect(res.statusCode).toBe(201)
        global.bookId = res.body.data._id                
    })

    // Test: get all book enpoint
    test("Test 2: get all book GET api/v1/books/", async () => {
        const token = jwt.sign(
            {
                id: 123, 
                name:"test User", 
                role:"admin"
            }, process.env.ACCESS_TOKEN_SECRET )

        const res = await request(app)
        .get(`/api/v1/books/`)
        .set("Authorization", `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
        const allBooks = res.body.data
        console.log(allBooks);    
    })

    // Test: get book by Id endpoint
    test("Test 3: get book by Id GET api/v1/books/:id", async () => {
        const token = jwt.sign(
            {
                id: 123, 
                name:"test User", 
                role:"admin"
            }, process.env.ACCESS_TOKEN_SECRET )

        const res = await request(app)
        .get(`/api/v1/books/${global.bookId}`)
        .set("Authorization", `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
    })

    // Test: Update book information by Id
    test("Test 4: Update book by Id PUT api/v1/books/:id", async () => {
        const token = jwt.sign(
            {
                id: 123, 
                name:"test User", 
                role:"admin"
            }, process.env.ACCESS_TOKEN_SECRET )

        const bookUpdate = {
            year: 2005
        }

        const res = await request(app)
        .put(`/api/v1/books/${global.bookId}`)
        .send(bookUpdate)
        .set("Authorization", `Bearer ${token}`)
        expect(res.statusCode).toBe(200)

        let newbook = res.body.data
        console.log(newbook);        
    })

    // Test: Delete book by Id
    test("Test 5: Delete book by Id DELETE api/v1/books/:id", async ()=> {
        const token = jwt.sign(
            {
                id: 123, 
                name:"test User", 
                role:"admin"
            }, process.env.ACCESS_TOKEN_SECRET )
        
        const res = await request(app)
        .delete(`/api/v1/books/${global.bookId}`)
        .set("Authorization", `Bearer ${token}`)
        expect(res.statusCode).toBe(200)
    })
})
