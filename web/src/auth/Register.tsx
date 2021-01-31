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
import { useAuth } from "./token";

export const Register: React.FC = () => {
  const history = useHistory();
  const user = useAuth();
  const {
    handleSubmit,
    control,
    errors,
    formState: { isSubmitting, isValid },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm: "",
    },
    mode: "onChange",
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
          try {
            await user.register(
              data.username,
              data.email,
              data.password,
              data.confirm
            );
            history.push("/login");
          } catch (err) {}
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
          disabled={isSubmitting || !isValid}
        >
          Submit
        </Button>
      </Grid>
    </Container>
  );
};
