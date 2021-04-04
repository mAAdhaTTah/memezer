import Chance from "chance";

declare global {
  interface Console {
    restore?(): void;
  }
}

export const chance = new Chance();

export const banConsole = () => {
  const _console = global.console;

  const makeProxyConsole = () => {
    const mock = {
      restore() {
        global.console = _console;
      },
    };

    const proxyConsole = new Proxy(_console, {
      get(target, property) {
        const result =
          Reflect.get(mock, property) ?? Reflect.get(target, property);

        if (
          jest.isMockFunction(result) ||
          typeof result !== "function" ||
          property === "restore"
        ) {
          return result;
        }

        const spy = jest.fn(result);
        Reflect.set(mock, property, spy);
        return spy;
      },
    });

    return proxyConsole;
  };

  beforeEach(() => {
    global.console.restore?.();
    global.console = makeProxyConsole();
  });

  afterEach(() => {
    const errors = [];

    for (const key in global.console) {
      const property = (global.console as any)[key];

      if (jest.isMockFunction(property)) {
        const callCount = property.mock.calls.length;
        if (callCount > 0) {
          errors.push(
            new Error(
              `Console#${key} called ${callCount} times during test run.`
            )
          );
        }
      }
    }

    global.console.restore?.();

    if (errors.length) {
      throw new AggregateError(
        errors,
        `Console is banned, but:

* ${errors.map((error) => error.message).join("\n* ")}`
      );
    }
  });
};
