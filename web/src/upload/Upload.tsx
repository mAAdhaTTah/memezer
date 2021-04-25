import { useHistory, Redirect } from "react-router-dom";
import { Button, Container, Grid, Typography } from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import { DropzoneArea } from "material-ui-dropzone";
import { useClient } from "../api";
import { useMemes } from "../memes";

export const Upload: React.FC = () => {
  const history = useHistory();
  const { isAuthenticated } = useClient();
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
  } = useForm<{ files: File[] }>({
    defaultValues: {
      files: [],
    },
    mode: "onChange",
  });
  const { uploadMeme } = useMemes();

  if (!isAuthenticated) {
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
          for (const file of data.files) {
            await uploadMeme(file);
          }
          history.push("/");
        })}
      >
        <Controller
          name="files"
          control={control}
          rules={{
            required: true,
          }}
          render={({ onChange }) => {
            return (
              <DropzoneArea
                filesLimit={10}
                acceptedFiles={["image/jpeg", "image/png", "image/bmp"]}
                onChange={(files) => {
                  onChange(files);
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
