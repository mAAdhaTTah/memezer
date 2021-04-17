import { createServer, Factory, Model, RestSerializer } from "miragejs";
import { act } from "react-dom/test-utils";
import { cache } from "swr";
import { formatISO } from "date-fns";
import { shared } from "../config";

declare global {
  const server: ReturnType<typeof createMockServer>;
}

export const createMockServer = ({
  environment = "development",
  urlPrefix = shared.API_BASE,
} = {}) =>
  createServer({
    environment,
    urlPrefix,

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

        uploaded_at() {
          return formatISO(new Date());
        },

        filename(i: number) {
          return `meme-${i}.jpg`;
        },

        file_url: "https://via.placeholder.com/400x600",

        accessibility_text: null,
      }),
    },

    seeds(server) {},

    routes() {
      this.post("/auth/register", (schema, request) => {
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
        const { models } = schema.all("meme");

        return {
          total: models.length,
          items: models,
          size: 50,
          page: 0,
        };
      });

      this.post("/memes", (schema, request) => {
        // This comes through as FormData.
        const formBody = (request.requestBody as unknown) as FormData;
        const file = formBody.get("file");
        if (!(file instanceof File)) {
          throw new Error("file should be a File");
        }
        const filename = file.name;

        // TODO(mAAdhaTTah) this seems like a bug or something I'm doing wrong?
        const meme = (this as any).build("meme");
        meme.title = filename;
        meme.filename = filename;
        const dbMeme = schema.create("meme", meme);
        meme.id = dbMeme.id;

        return meme;
      });
    },
  });

export const setupServerInTests = () => {
  beforeEach(() => {
    createMockServer({ environment: "test" });
    (server as any).loadFactories();
  });

  afterEach(async () => {
    server.shutdown();
    await act(async () => {
      await cache.clear();
    });
  });
};
