import React from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Container,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { Link } from "react-router-dom";
import { MemeView } from "../memes";
import { UPLOAD } from "../upload";
import { EDIT } from "../edit";
import { MainLink } from "./MainLink";
import { useMediaStyles } from "./styles";

export const SuccessView: React.FC<{
  page: number;
  totalPages: number;
  memes: MemeView[];
  onPage: (page: number) => void;
}> = ({ page, totalPages, memes, onPage }) => {
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
    <Box display="flex" flexDirection="column">
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
              <CardActions disableSpacing>
                <Button
                  size="small"
                  color="primary"
                  component={Link}
                  to={EDIT.replace(":memeId", meme.id)}
                >
                  Edit
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="center" mt={1} py={3}>
        <Pagination
          page={page}
          count={totalPages}
          onChange={(_, page) => onPage(page)}
          color="primary"
        />
      </Box>
    </Box>
  );
};
