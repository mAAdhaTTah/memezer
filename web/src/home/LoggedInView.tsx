import React, { useState } from "react";
import { Box, TextField } from "@material-ui/core";
import { match } from "variant";
import { useMemes } from "../memes";
import { ErrorView } from "./ErrorView";
import { LoadingView } from "./LoadingView";
import { SuccessView } from "./SuccessView";

export const LoggedInView = () => {
  const [term, setTerm] = useState("");
  const { result } = useMemes({ term });

  return (
    <>
      <Box mb={2}>
        <TextField
          id="term"
          label="Search"
          fullWidth
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </Box>
      {match(result, {
        loading: () => <LoadingView />,
        success: ({ data: memes }) => <SuccessView memes={memes} />,
        error: ({ error }) => <ErrorView error={error} />,
      })}
    </>
  );
};
