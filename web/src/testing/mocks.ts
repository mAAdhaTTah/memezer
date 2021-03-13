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
    const proxyConsole = new Proxy(_console, {
      get(target, property) {
        const result = Reflect.get(target, property);

        if (
          jest.isMockFunction(result) ||
          typeof result !== "function" ||
          property === "restore"
        ) {
          return result;
        }

        const spy = jest.fn(result);
        Reflect.set(target, property, spy);
        return spy;
      },
    });

    proxyConsole.restore = () => {
      global.console = _console;
    };

    return proxyConsole;
  };

  beforeEach(() => {
    global.console.restore?.();
    global.console = makeProxyConsole();
  });

  afterEach(() => {
    for (const key in global.console) {
      const property = (global.console as any)[key];

      if (jest.isMockFunction(property)) {
        const callCount = property.mock.calls.length;
        if (callCount > 0) {
          throw new Error(
            `Console#${key} called ${callCount} times during test run.`
          );
        }
      }
    }

    global.console.restore?.();
  });
};
