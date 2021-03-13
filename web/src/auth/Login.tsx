import React from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import { HOME } from "../home/routes";
import { useClient } from "../api";

export const Login: React.FC = () => {
  const history = useHistory();
  const client = useClient();
  const {
    handleSubmit,
    control,
    errors,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Container maxWidth="xs">
      <Typography component="h4" variant="h4" align="center">
        Login
      </Typography>
      <Grid
        component="form"
        container
        direction="column"
        onSubmit={handleSubmit(async (data) => {
          await client.login(data.username, data.password);
          history.push(HOME);
        })}
      >
        <Box mb={2}>
          <Controller
            control={control}
            name="username"
            rules={{
              required: true,
            }}
            render={({ value, onChange }) => {
              return (
                <TextField
                  id="username"
                  label="Email or Username"
                  fullWidth
                  value={value}
                  onChange={onChange}
                  error={!!errors.username}
                />
              );
            }}
          />
        </Box>
        <Box mb={4}>
          <Controller
            control={control}
            name="password"
            rules={{
              required: true,
            }}
            render={({ value, onChange }) => {
              return (
                <TextField
                  id="password"
                  label="Password"
                  type="password"
                  fullWidth
                  value={value}
                  onChange={onChange}
                  error={!!errors.password}
                />
              );
            }}
          />
        </Box>
        <Button
          color="primary"
          variant="contained"
          type="submit"
          disabled={isSubmitting}
        >
          Submit
        </Button>
      </Grid>
    </Container>
  );
};
