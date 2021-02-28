import { Story } from "@storybook/react";
import { fromUnixTime } from "date-fns";
import * as React from "react";
import { SuccessView } from "./SuccessView";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Home/SuccessView",
};

type Props = React.ComponentProps<typeof SuccessView>;

const Template: Story<Props> = (props) => <SuccessView {...props} />;

export const empty = Template.bind({});
empty.args = {
  memes: [],
};

export const uploaded = Template.bind({});
uploaded.args = {
  memes: [
    {
      // TODO(mAAdhaTTah) reuse the Mirage Factory?
      id: "1",
      title: "Meme 0",
      filename: "meme-1.jpg",
      file_url: "https://via.placeholder.com/400x600",
      uploaded_at: fromUnixTime(Date.now()),
    },
  ],
};
