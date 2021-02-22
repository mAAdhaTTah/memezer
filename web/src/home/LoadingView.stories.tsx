import { Story } from "@storybook/react";
import * as React from "react";
import { LoadingView } from "./LoadingView";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Home/LoadingView",
};

type Props = React.ComponentProps<typeof LoadingView>;

const Template: Story<Props> = (props) => <LoadingView {...props} />;

export const basic = Template.bind({});
