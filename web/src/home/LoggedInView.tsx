import React from "react";
import { match } from "variant";
import { useMemes } from "../memes";
import { ErrorView } from "./ErrorView";
import { LoadingView } from "./LoadingView";
import { SuccessView } from "./SuccessView";

export const LoggedInView = () => {
  const { result } = useMemes();

  return match(result, {
    loading: () => <LoadingView />,
    success: ({ data: memes }) => <SuccessView memes={memes} />,
    error: ({ error }) => <ErrorView error={error} />,
  });
};
