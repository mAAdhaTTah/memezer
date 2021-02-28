import React from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@material-ui/core";
import { MemeListView } from "../memes";
import { UPLOAD } from "../upload";
import { MainLink } from "./MainLink";
import { useMediaStyles } from "./styles";

export const SuccessView: React.FC<{ memes: MemeListView }> = ({ memes }) => {
  const classes = useMediaStyles();

  if (memes.length === 0) {
    return (
      <Box
        display="flex"
        alignItems="center"
        flexDirection="column"
        data-testid="home-empty"
      >
        <Typography align="center" component="h3" variant="h2" gutterBottom>
          Upload some memes!
        </Typography>
        <MainLink to={UPLOAD}>Upload</MainLink>
      </Box>
    );
  }

  return (
    <Grid container spacing={2} data-testid="home-success">
      {memes.map((meme) => (
        <Grid key={meme.id} item xs={6} md={4}>
          <Card>
            <CardMedia image={meme.file_url} className={classes.media} />
            <CardContent>
              <Typography component="h3" variant="h4">
                {meme.title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
