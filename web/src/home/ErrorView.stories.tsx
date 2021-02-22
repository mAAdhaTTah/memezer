import { Story } from "@storybook/react";
import { AxiosError } from "axios";
import * as React from "react";
import { Failure, StructError } from "superstruct";
import { ErrorView } from "./ErrorView";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Home/ErrorView",
};

const failure: Failure = {
  key: "hello",
  value: "world",
  type: "string",
  refinement: undefined,
  message: "Hello failed world",
  branch: [],
  path: [],
};

const structError: StructError = new StructError(failure, function* () {});

const axiosError: AxiosError = {
  message: "Request failed with error 500",
  config: {},
  isAxiosError: true,
  toJSON: () => ({}),
  name: "AxiosError",
};

type Props = React.ComponentProps<typeof ErrorView>;

const Template: Story<Props> = (props) => <ErrorView {...props} />;

export const withStructError = Template.bind({});
withStructError.args = {
  error: structError,
};

export const withAxiosError = Template.bind({});
withAxiosError.args = {
  error: axiosError,
};
