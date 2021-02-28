import { useHistory, Redirect } from "react-router-dom";
import { Button, Container, Grid, Typography } from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import { DropzoneArea } from "material-ui-dropzone";
import { useAuth } from "../auth";
import { useMemes } from "../memes";

export const Upload: React.FC = () => {
  const history = useHistory();
  const { token } = useAuth();
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
  } = useForm<{ file: null | File }>({
    defaultValues: {
      file: null,
    },
    mode: "onChange",
  });
  const { uploadMeme } = useMemes();

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
          await uploadMeme(data.file!);
          history.push("/");
        })}
      >
        <Controller
          name="file"
          control={control}
          rules={{
            required: true,
          }}
          render={({ onChange }) => {
            return (
              <DropzoneArea
                filesLimit={1}
                acceptedFiles={["image/jpeg", "image/png", "image/bmp"]}
                onChange={(files) => {
                  onChange(files[0]);
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
