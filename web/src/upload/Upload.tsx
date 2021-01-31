import { useHistory, Redirect } from "react-router-dom";
import { Button, Container, Grid, Typography } from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import { DropzoneArea } from "material-ui-dropzone";
import { useAuth } from "../auth";

export const Upload: React.FC = () => {
  const history = useHistory();
  const { token } = useAuth();
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
    trigger,
  } = useForm({
    defaultValues: {
      files: [],
    },
    mode: "onChange",
  });

  if (!token) {
    return <Redirect to="/" />;
  }

  return (
    <Container maxWidth="xs">
      <Typography component="h4" variant="h4" align="center">
        Upload
      </Typography>
      <Grid
        component="form"
        container
        direction="column"
        onSubmit={handleSubmit(async (data) => {
          const formData = new FormData();
          formData.append("file", data.files[0]);
          const response = await fetch(
            `${process.env.REACT_APP_API_BASE}/memes`,
            {
              method: "POST",
              body: formData,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            history.push("/");
          }
        })}
      >
        <Controller
          name="files"
          control={control}
          rules={{
            validate: (files) => files.length === 1,
          }}
          render={({ onChange }) => {
            return (
              <DropzoneArea
                filesLimit={1}
                acceptedFiles={["image/jpeg", "image/png", "image/bmp"]}
                onChange={(files) => {
                  onChange(files);
                  trigger("files");
                }}
              />
            );
          }}
        />
        <Button
          color="primary"
          variant="contained"
          type="submit"
          disabled={isSubmitting || !isValid}
        >
          Submit
        </Button>
      </Grid>
    </Container>
  );
};
