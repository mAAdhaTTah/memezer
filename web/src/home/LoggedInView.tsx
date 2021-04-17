import React, { useEffect, useMemo, useState } from "react";
import { Box, TextField, Container } from "@material-ui/core";
import { match } from "variant";
import { useHistory } from "react-router";
import { coerce, number, string, validate } from "superstruct";
import { useMemes } from "../memes";
import { ErrorView } from "./ErrorView";
import { LoadingView } from "./LoadingView";
import { SuccessView } from "./SuccessView";
import { HOME } from "./routes";

const PageParam = coerce(number(), string(), (value) => parseInt(value, 0));

export const LoggedInView: React.FC = () => {
  const history = useHistory();
  const [term, setTerm] = useState("");
  const [search, setSearch] = useState(
    // this won't trigger a rerender on its own
    // so we keep in state & `listen` in useEffect
    new URLSearchParams(history.location.search)
  );
  const pageParam = search.get("page");
  const params = useMemo(() => {
    const params: Parameters<typeof useMemes>[0] = {
      // 30 works regardless of 2-across or 3-across
      size: 30,
    };

    if (term) {
      params.term = term;
    }

    const results = validate(pageParam, PageParam, { coerce: true });

    if (results[1]) {
      params.page = Math.max(results[1] - 1, 0);
    }

    return params;
  }, [pageParam, term]);
  const { result } = useMemes(params);

  useEffect(() => {
    const unregister = history.listen((location) => {
      setSearch(new URLSearchParams(location.search));
    });

    return () => unregister();
  }, [history]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageParam]);

  return (
    <Container>
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
        success: ({ data }) => (
          <SuccessView
            memes={data.items}
            page={params.page ? params.page + 1 : 1}
            totalPages={Math.ceil(data.total / data.size)}
            onPage={(page) => {
              history.push({
                pathname: `${HOME}`,
                search: `?${new URLSearchParams({
                  page: String(page),
                }).toString()}`,
              } as any);
            }}
          />
        ),
        error: ({ error }) => <ErrorView error={error} />,
      })}
    </Container>
  );
};
