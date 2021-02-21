import initStoryshots, { renderWithOptions } from "@storybook/addon-storyshots";
import { render, RenderResult } from "@testing-library/react";

initStoryshots({
  suite: "PropTypes",
  framework: "react",
  test: renderWithOptions({ renderer: render }),
  snapshotSerializers: [
    {
      print: (val, serialize) =>
        serialize((val as RenderResult).container.firstChild),
      test: (val) => val && val.hasOwnProperty("container"),
    },
  ],
});
