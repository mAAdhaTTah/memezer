import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Grid,
  Button,
  Snackbar,
  ButtonGroup,
} from "@material-ui/core";
import { match } from "variant";
import { useForm, Controller } from "react-hook-form";
import { AxiosError } from "axios";
import { Alert } from "@material-ui/lab";
import { MemeUpdate, MemeView, useMeme } from "../memes";
import { AsyncResult } from "../api";
import { useHistory } from "react-router";

const SuccessView: React.FC<{
  initialMeme: MemeUpdate;
  memeUrl: string;
  memeAlt: string;
  onSubmit: (
    update: MemeUpdate
  ) => Promise<AsyncResult<MemeView, AxiosError | Error>>;
  onDeleteClick: () => void;
}> = ({ initialMeme, memeUrl, memeAlt, onSubmit, onDeleteClick }) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: initialMeme.title,
      accessibility_text: initialMeme.accessibility_text,
    },
  });

  const [snackbar, setSnackbar] = useState<{
    severity: "success" | "error";
    message: string;
  } | null>(null);

  const onSnackbarClose = () => setSnackbar(null);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper elevation={3}>
          <Box m={2} display="flex" justifyContent="center">
            <img src={memeUrl} alt={memeAlt} style={{ maxWidth: "100%" }} />
          </Box>
        </Paper>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        component="form"
        onSubmit={handleSubmit(async (data) => {
          match(await onSubmit(data), {
            success({ data }) {
              reset({
                title: data.title,
                accessibility_text: data.accessibility_text,
              });
              setSnackbar({ severity: "success", message: "Saved!" });
            },
            error({ error }) {
              setSnackbar({ severity: "error", message: error.message });
            },
          });
        })}
      >
        <Typography component="h3" variant="h4" align="center">
          Edit meme
        </Typography>
        <Box mb={2}>
          <Controller
            name="title"
            control={control}
            rules={{
              required: true,
            }}
            render={({ name, value, onChange }) => {
              return (
                <TextField
                  id={name}
                  label="Title"
                  fullWidth
                  error={!!errors[name as keyof typeof errors]}
                  value={value}
                  onChange={onChange}
                />
              );
            }}
          />
        </Box>
        <Box mb={2}>
          <Controller
            name="accessibility_text"
            control={control}
            rules={{
              required: true,
            }}
            render={({ name, value, onChange }) => {
              return (
                <TextField
                  id={name}
                  label="Accessibility Text"
                  fullWidth
                  multiline
                  rows={6}
                  error={!!errors[name as keyof typeof errors]}
                  value={value}
                  onChange={onChange}
                />
              );
            }}
          />
        </Box>
        <ButtonGroup variant="contained">
          <Button color="primary" type="submit" disabled={isSubmitting}>
            Submit
          </Button>
          <Button
            color="secondary"
            type="button"
            onClick={() => onDeleteClick()}
          >
            Delete
          </Button>
        </ButtonGroup>
      </Grid>
      {snackbar && (
        <Snackbar
          open={!!snackbar}
          autoHideDuration={6000}
          onClose={onSnackbarClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Alert onClose={onSnackbarClose} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </Grid>
  );
};

export const View: React.FC<{ memeId: string }> = ({ memeId }) => {
  const { meme, updateMeme, deleteMeme } = useMeme(memeId);
  const history = useHistory();

  return (
    <Container>
      <Typography component="h1" variant="h1" align="center">
        Editing
      </Typography>
      {match(meme, {
        loading: () => null,
        error: () => null,
        success: ({ data }) => (
          <SuccessView
            initialMeme={{
              title: data.title,
              accessibility_text: data.accessibility_text ?? "",
            }}
            memeUrl={data.file_url}
            memeAlt={data.title}
            onSubmit={updateMeme}
            onDeleteClick={async () => {
              await deleteMeme();
              history.push("/");
            }}
          />
        ),
      })}
    </Container>
  );
};
