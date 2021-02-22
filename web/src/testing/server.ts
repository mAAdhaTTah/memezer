import { createServer, Factory, Model, RestSerializer } from "miragejs";
import { cache } from "swr";
import { shared } from "../config";

declare global {
  const server: ReturnType<typeof createMockServer>;
}

export const createMockServer = ({ environment = "development" } = {}) =>
  createServer({
    environment,
    urlPrefix: shared.API_BASE,

    serializers: {
      application: RestSerializer,
    },

    models: {
      user: Model,
      meme: Model,
    },

    factories: {
      user: Factory.extend({
        username: "admin",
        password: "password",
      }),
      meme: Factory.extend({
        title(i: number) {
          return `Meme ${i}`;
        },

        filename: "https://via.placeholder.com/400x600",
      }),
    },

    seeds(server) {},

    routes() {
      this.post("/users", (schema, request) => {
        const body = JSON.parse(request.requestBody);

        return schema.db.user.insert(body);
      });

      this.post("/auth/login", (schema, request) => {
        const body = JSON.parse(request.requestBody);

        return schema.where("user", {
          username: body.username,
          password: body.password,
        });
      });

      this.get("/memes", (schema) => {
        return schema.all("meme").models;
      });
    },
  });

export const setupServerInTests = () => {
  beforeEach(() => {
    createMockServer({ environment: "test" });
  });

  afterEach(async () => {
    server.shutdown();
    await cache.clear();
  });
};
