const { tables } = require("../../src/data");
const { withServer, login } = require("../supertest.setup");
const { testAuthHeader } = require("../common/auth");

const data = {
  products: [
    {
      productID: 28,
      categoryID: 1,
      person: "MEN",
      type: "Hoodie",
      picture: "hoodies/Trui.jpg",
      productName: "Trui",
      color: "BLUE",
      size: "XS",
      price: 20,
      brand: "Tommy Hilfiger",
    },
    {
      productID: 29,
      categoryID: 2,
      person: "WOMEN",
      type: "Shirt",
      picture: "shirts/T-shirt.jpg",
      productName: "T-shirt",
      color: "BLACK",
      size: "S",
      price: 30.5,
      brand: "Calvin Klein",
    },
    {
      productID: 30,
      categoryID: 3,
      person: "MEN",
      type: "Trouser",
      picture: "trousers/Broek.jpg",
      productName: "Broek",
      color: "GREEN",
      size: "M",
      price: 50,
      brand: "Tommy Hilfiger",
    },
    {
      productID: 31,
      categoryID: 3,
      person: "WOMEN",
      type: "Accessory",
      picture: "accessories/Pet.jpg",
      productName: "Pet",
      color: "RED",
      size: "/",
      price: 99.99,
      brand: "Calvin Klein",
    },
  ],
};

const dataToDelete = {
  products: [28, 29, 30, 31],
};

describe("Products", () => {
  let request, knex, authHeader;

  withServer(({ supertest, knex: k }) => {
    request = supertest;
    knex = k;
  });

  beforeAll(async () => {
    authHeader = await login(request);
  });

  const url = "/api/products";

  describe("GET /api/products", () => {
    beforeAll(async () => {
      await knex(tables.product).insert(data.products);
    });

    afterAll(async () => {
      await knex(tables.product)
        .whereIn("productID", dataToDelete.products)
        .delete();
    });

    it("should return 200 and all products", async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(31);

      expect(response.body.items[27]).toEqual({
        productID: 28,
        categoryID: 1,
        person: "MEN",
        type: "Hoodie",
        picture: "hoodies/Trui.jpg",
        productName: "Trui",
        color: "BLUE",
        size: "XS",
        price: 20,
        brand: "Tommy Hilfiger",
      });
      expect(response.body.items[28]).toEqual({
        productID: 29,
        categoryID: 2,
        person: "WOMEN",
        type: "Shirt",
        picture: "shirts/T-shirt.jpg",
        productName: "T-shirt",
        color: "BLACK",
        size: "S",
        price: 30.5,
        brand: "Calvin Klein",
      });
      expect(response.body.items[29]).toEqual({
        productID: 30,
        categoryID: 3,
        person: "MEN",
        type: "Trouser",
        picture: "trousers/Broek.jpg",
        productName: "Broek",
        color: "GREEN",
        size: "M",
        price: 50,
        brand: "Tommy Hilfiger",
      });
      expect(response.body.items[30]).toEqual({
        productID: 31,
        categoryID: 3,
        person: "WOMEN",
        type: "Accessory",
        picture: "accessories/Pet.jpg",
        productName: "Pet",
        color: "RED",
        size: "/",
        price: 99.99,
        brand: "Calvin Klein",
      });
    });

    it("should 400 when given an argument", async () => {
      const response = await request.get(`${url}?invalid=true`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.query).toHaveProperty("invalid");
    });
  });

  describe("GET /api/products/:productID", () => {
    beforeAll(async () => {
      await knex(tables.product).insert(data.products[0]);
    });

    afterAll(async () => {
      await knex(tables.product)
        .whereIn("productID", dataToDelete.products)
        .delete();
    });

    it("should 200 and return the requested product", async () => {
      const response = await request.get(`${url}/28`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        productID: 28,
        categoryID: 1,
        person: "MEN",
        type: "Hoodie",
        picture: "hoodies/Trui.jpg",
        productName: "Trui",
        color: "BLUE",
        size: "XS",
        price: 20,
        brand: "Tommy Hilfiger",
      });
    });

    it("should 404 when requesting not existing product", async () => {
      const response = await request.get(`${url}/50`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "No product with id 50 exist",
        details: {
          id: 50,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it("should 400 with invalid product id", async () => {
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("productID");
    });
  });

  describe("GET /api/products/category/:categoryID", () => {
    beforeAll(async () => {
      await knex(tables.product).insert(data.products);
    });

    afterAll(async () => {
      await knex(tables.product)
        .whereIn("productID", dataToDelete.products)
        .delete();
    });

    it("should 200 and return the requested product", async () => {
      const response = await request.get(`${url}/category/1`);
      expect(response.status).toBe(200);
    });

    it("should 404 when requesting not existing category", async () => {
      const response = await request.get(`/api/categories/10`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "No category with id 10 exists",
        details: {
          id: 10,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it("should 400 with invalid category id", async () => {
      const response = await request.get(`${url}/category/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("categoryID");
    });
  });

  describe("POST /api/products", () => {
    const productsToDelete = [];

    afterAll(async () => {
      await knex(tables.product)
        .whereIn("productID", productsToDelete)
        .delete();
    });

    it("should 201 and return the created product", async () => {
      const response = await request
        .post(url)
        .set("Authorization", authHeader)
        .send({
          categoryID: 1,
          person: "MEN",
          type: "Hoodie",
          picture: "hoodies/Nieuwe trui.jpg",
          productName: "Nieuwe trui",
          color: "BLACK",
          size: "XL",
          price: 30,
          brand: "Tommy Hilfiger",
        });

      expect(response.status).toBe(201);
      expect(response.body.productID).toBeTruthy();
      expect(response.body.categoryID).toBe(1);
      expect(response.body.color).toBe("BLACK");
      expect(response.body.price).toBe(30);

      productsToDelete.push(response.body.productID);
    });

    it("should 400 when missing categoryID", async () => {
      const response = await request
        .post(url)
        .set("Authorization", authHeader)
        .send({
          person: "MEN",
          type: "Hoodie",
          picture: "hoodies/Nieuwe trui.jpg",
          productName: "Nieuwe trui",
          color: "BLACK",
          size: "XL",
          price: 30,
          brand: "Tommy Hilfiger",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("categoryID");
    });

    testAuthHeader(() => request.post(url));
  });

  describe("PUT /api/products/:productID", () => {
    beforeAll(async () => {
      await knex(tables.product).insert(data.products);
    });
    afterAll(async () => {
      await knex(tables.product)
        .whereIn("productID", dataToDelete.products)
        .delete();
    });

    it("should 204 and return the updated product", async () => {
      const response = await request
        .put(`${url}/30`)
        .set("Authorization", authHeader)
        .send({
          categoryID: 3,
          person: "MEN",
          type: "Trouser",
          picture: "trousers/Nieuwe broek.jpg",
          productName: "Nieuwe broek",
          color: "GREEN",
          size: "M",
          price: 50,
          brand: "Tommy Hilfiger",
        });

      expect(response.status).toBe(204);
    });

    it("should 404 when updating not existing product", async () => {
      const response = await request
        .put(`${url}/55`)
        .set("Authorization", authHeader)
        .send({
          categoryID: 3,
          person: "MEN",
          type: "Trouser",
          picture: "trousers/Nieuwe broek.jpg",
          productName: "Nieuwe broek",
          color: "GREEN",
          size: "M",
          price: 50,
          brand: "Tommy Hilfiger",
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "No product with id 55 exist",
        details: {
          id: 55,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it("should 400 when missing productName", async () => {
      const response = await request
        .put(`${url}/30`)
        .set("Authorization", authHeader)
        .send({
          categoryID: 3,
          person: "MEN",
          type: "Trouser",
          picture: "trousers/Nieuwe broek.jpg",
          color: "GREEN",
          size: "M",
          price: 50,
          brand: "Tommy Hilfiger",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("productName");
    });

    testAuthHeader(() => request.put(`${url}/30`));
  });

  describe("DELETE /api/products/:productID", () => {
    beforeAll(async () => {
      await knex(tables.product).insert(data.products[0]);
    });
    afterAll(async () => {
      await knex(tables.product)
        .whereIn("productID", dataToDelete.products)
        .delete();
    });

    it("should 204 and return nothing", async () => {
      const response = await request
        .delete(`${url}/28`)
        .set("Authorization", authHeader);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it("should 404 with not existing product", async () => {
      const response = await request
        .delete(`${url}/60`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "No product with id 60 exist",
        details: {
          id: 60,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it("should 400 with invalid product id", async () => {
      const response = await request
        .delete(`${url}/invalid`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("productID");
    });

    testAuthHeader(() => request.delete(`${url}/28`));
  });
});
