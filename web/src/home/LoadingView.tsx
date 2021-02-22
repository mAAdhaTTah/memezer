import React from "react";
import { Skeleton } from "@material-ui/lab";
import {
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@material-ui/core";
import { useMediaStyles } from "./styles";

export const LoadingView: React.FC = () => {
  const classes = useMediaStyles();

  return (
    <Grid container spacing={2} data-testid="home-loading">
      {new Array(10).fill(null).map((_, i) => (
        <Grid key={i} item xs={6} md={4}>
          <Card>
            <CardMedia>
              <Skeleton className={classes.media} />
            </CardMedia>
            <CardContent>
              <Typography component="h3" variant="h4">
                <Skeleton />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
