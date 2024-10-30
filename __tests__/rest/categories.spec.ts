const { tables } = require("../../src/data");
const { withServer, login } = require("../supertest.setup");
const { testAuthHeader } = require("../common/auth");

const data = {
  categories: [
    {
      categoryID: 5,
      name: "Test category 1",
    },
    {
      categoryID: 6,
      name: "Test category 2",
    },
    {
      categoryID: 7,
      name: "Test category 3",
    },
  ],
};

const dataToDelete = {
  categories: [5, 6, 7],
};

describe("Categories", () => {
  let request, knex, authHeader;

  withServer(({ supertest, knex: k }) => {
    request = supertest;
    knex = k;
  });

  beforeAll(async () => {
    authHeader = await login(request);
  });

  const url = "/api/categories";

  describe("GET /api/categories", () => {
    beforeAll(async () => {
      await knex(tables.category).insert(data.categories);
    });

    afterAll(async () => {
      await knex(tables.category)
        .whereIn("categoryID", dataToDelete.categories)
        .delete();
    });

    it("should return 200 and all categories", async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(7);

      expect(response.body.items[4]).toEqual({
        categoryID: 5,
        name: "Test category 1",
      });
      expect(response.body.items[5]).toEqual({
        categoryID: 6,
        name: "Test category 2",
      });
      expect(response.body.items[6]).toEqual({
        categoryID: 7,
        name: "Test category 3",
      });
    });

    it("should 400 when given an argument", async () => {
      const response = await request.get(`${url}?invalid=true`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.query).toHaveProperty("invalid");
    });
  });

  describe("GET /api/categories/:categoryID", () => {
    beforeAll(async () => {
      await knex(tables.category).insert(data.categories);
    });

    afterAll(async () => {
      await knex(tables.category)
        .whereIn("categoryID", dataToDelete.categories)
        .delete();
    });

    it("should 200 and return the requested category", async () => {
      const response = await request.get(`${url}/5`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        categoryID: 5,
        name: "Test category 1",
      });
    });

    it("should 200 and return the requested category", async () => {
      const response = await request.get(`${url}/6`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        categoryID: 6,
        name: "Test category 2",
      });
    });

    it("should 404 when requesting not existing category", async () => {
      const response = await request.get(`${url}/10`);

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
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("categoryID");
    });
  });

  describe("POST /api/categories", () => {
    const categoriesToDelete = [];

    afterAll(async () => {
      await knex(tables.category)
        .whereIn("categoryID", categoriesToDelete)
        .delete();
    });

    it("should 201 and return the created category", async () => {
      const response = await request
        .post(url)
        .set("Authorization", authHeader)
        .send({
          name: "Test category",
        });

      expect(response.status).toBe(201);
      expect(response.body.categoryID).toBeTruthy();
      expect(response.body.name).toBe("Test category");

      categoriesToDelete.push(response.body.categoryID);
    });

    it("should 400 when missing name", async () => {
      const response = await request
        .post(url)
        .set("Authorization", authHeader)
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("name");
    });

    it("should 400 when name is decimal", async () => {
      const response = await request
        .post(url)
        .set("Authorization", authHeader)
        .send({
          name: 10,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("name");
    });

    testAuthHeader(() => request.post(url));
  });

  describe("PUT /api/categories/:categoryID", () => {
    beforeAll(async () => {
      await knex(tables.category).insert(data.categories);
    });
    afterAll(async () => {
      await knex(tables.category)
        .whereIn("categoryID", dataToDelete.categories)
        .delete();
    });

    it("should 204 and return the updated category", async () => {
      const response = await request
        .put(`${url}/5`)
        .set("Authorization", authHeader)
        .send({
          name: "Test category updated",
        });

      expect(response.status).toBe(204);
    });

    it("should 404 when updating not existing category", async () => {
      const response = await request
        .put(`${url}/15`)
        .set("Authorization", authHeader)
        .send({
          name: "test",
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "No category with id 15 exists",
        details: {
          id: 15,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it("should 400 when missing name", async () => {
      const response = await request
        .put(`${url}/5`)
        .set("Authorization", authHeader)
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("name");
    });

    testAuthHeader(() => request.put(`${url}/5`));
  });

  describe("DELETE /api/categories/:categoryID", () => {
    beforeAll(async () => {
      await knex(tables.category).insert(data.categories[0]);
    });
    afterAll(async () => {
      await knex(tables.category)
        .whereIn("categoryID", dataToDelete.categories)
        .delete();
    });

    it("should 204 and return nothing", async () => {
      const response = await request
        .delete(`${url}/5`)
        .set("Authorization", authHeader);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it("should 404 with not existing category", async () => {
      const response = await request
        .delete(`${url}/15`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "No category with id 15 exists",
        details: {
          id: 15,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it("should 400 with invalid category id", async () => {
      const response = await request
        .delete(`${url}/invalid`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("categoryID");
    });

    testAuthHeader(() => request.delete(`${url}/5`));
  });
});
