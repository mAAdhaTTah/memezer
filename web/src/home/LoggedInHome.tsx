import React, { useEffect, useState } from "react";
import { Typography, GridList, GridListTile } from "@material-ui/core";
import { useAuth } from "../auth";

export const LoggedInHome = () => {
  const { token } = useAuth();
  const [memes, setMemes] = useState<{ title: string }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE}/memes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const body = await response.json();
          setMemes(body);
        }
      } catch (err) {}
    })();
  }, [token]);
  return (
    <GridList cols={3} cellHeight={160}>
      {memes.length === 0 ? (
        <GridListTile cols={3}>
          <Typography component="p" variant="body2">
            No memes loaded
          </Typography>
        </GridListTile>
      ) : (
        memes.map((meme: any) => (
          <GridListTile key={meme.title} cols={1}>
            <Typography component="p" variant="body2">
              {meme.title}
            </Typography>
          </GridListTile>
        ))
      )}
    </GridList>
  );
};
