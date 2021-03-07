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
import { useClient } from "../api";
import { HOME } from "../home";

export const Register: React.FC = () => {
  const history = useHistory();
  const client = useClient();
  const {
    handleSubmit,
    control,
    errors,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm: "",
    },
  });

  return (
    <Container maxWidth="xs">
      <Typography component="h4" variant="h4" align="center">
        Register
      </Typography>
      <Grid
        component="form"
        container
        direction="column"
        onSubmit={handleSubmit(async (data) => {
          await client.register(
            data.username,
            data.email,
            data.password,
            data.confirm
          );
          history.push(HOME);
        })}
      >
        <Box mb={2}>
          <Controller
            name="username"
            control={control}
            rules={{
              required: true,
            }}
            render={({ value, onChange }) => {
              return (
                <TextField
                  id="username"
                  label="Username"
                  fullWidth
                  error={!!errors.username}
                  value={value}
                  onChange={onChange}
                />
              );
            }}
          />
        </Box>
        <Box mb={2}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: true,
              pattern: /^\S+@\S+$/,
            }}
            render={({ value, onChange }) => {
              return (
                <TextField
                  id="email"
                  label="Email"
                  fullWidth
                  error={!!errors.email}
                  value={value}
                  onChange={onChange}
                />
              );
            }}
          />
        </Box>
        <Box mb={2}>
          <Controller
            name="password"
            control={control}
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
                  error={!!errors.password}
                  value={value}
                  onChange={onChange}
                />
              );
            }}
          />
        </Box>
        <Box mb={4}>
          <Controller
            name="confirm"
            control={control}
            rules={{
              required: true,
              validate: {
                matchPassword: (value) => value === watch("password"),
              },
            }}
            render={({ value, onChange }) => {
              return (
                <TextField
                  id="confirm"
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  error={!!errors.confirm}
                  value={value}
                  onChange={onChange}
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
