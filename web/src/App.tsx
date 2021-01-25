import React, { forwardRef, useEffect, useState } from "react";
import { Switch, Route, Link, useHistory, Redirect } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  Menu,
  MenuItem,
  TextField,
  Link as LinkUi,
  Typography,
  GridList,
  GridListTile,
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import useLocalStorage from "react-use-localstorage";
import { Controller, useForm } from "react-hook-form";
import { DropzoneArea } from "material-ui-dropzone";

const useToken = () => useLocalStorage("memezer-token");

const LoggedOutMenu: React.FC<{ onMenuClick: () => void }> = ({
  onMenuClick,
}) => {
  return (
    <>
      <MenuItem onClick={onMenuClick}>
        <Link to="/login">Login</Link>
      </MenuItem>
      <MenuItem onClick={onMenuClick}>
        <Link to="/register">Register</Link>
      </MenuItem>
    </>
  );
};

const LoggedInMenu: React.FC<{ onMenuClick: () => void }> = ({
  onMenuClick,
}) => {
  return (
    <>
      <MenuItem onClick={onMenuClick}>
        <Link to="/">Home</Link>
      </MenuItem>
      <MenuItem onClick={onMenuClick}>
        <Link to="/upload">Upload</Link>
      </MenuItem>
    </>
  );
};

const Header: React.FC = () => {
  const [token] = useToken();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const onClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container maxWidth="lg">
      <Grid component="header" container direction="row-reverse">
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          aria-label="Open Menu"
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
          }}
        >
          <MenuIcon />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={onClose}
        >
          {token ? (
            <LoggedInMenu onMenuClick={onClose} />
          ) : (
            <LoggedOutMenu onMenuClick={onClose} />
          )}
        </Menu>
      </Grid>
    </Container>
  );
};

const LoggedInHome = () => {
  const [token] = useToken();
  const [memes, setMemes] = useState<{ title: string }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE}/memes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const body = await response.json();
          setMemes(body);
        }
      } catch (err) {}
    })();
  }, [token]);
  return (
    <GridList cols={3} cellHeight={160}>
      {memes.length === 0 ? (
        <GridListTile cols={3}>
          <Typography component="p" variant="body2">
            No memes loaded
          </Typography>
        </GridListTile>
      ) : (
        memes.map((meme: any) => (
          <GridListTile key={meme.title} cols={1}>
            <Typography component="p" variant="body2">
              {meme.title}
            </Typography>
          </GridListTile>
        ))
      )}
    </GridList>
  );
};

const MainLink = forwardRef((props, ref) => {
  return <LinkUi innerRef={ref} {...props} variant="body2" color="secondary" />;
});

const LoggedOutHome = () => {
  return (
    <Grid container alignContent="center" direction="column">
      <Box mb={8}>
        <Typography component="h4" variant="h4" align="center">
          You are not logged in
        </Typography>
      </Box>
      <Grid
        container
        alignContent="center"
        justify="space-around"
        direction="row"
      >
        <Link to="/login" component={MainLink}>
          Login
        </Link>
        <Link to="/register" component={MainLink}>
          Register
        </Link>
      </Grid>
    </Grid>
  );
};

const Upload: React.FC = () => {
  const history = useHistory();
  const [token] = useToken();
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

const Home: React.FC = () => {
  const [token] = useToken();

  return (
    <Container maxWidth="xs">
      {token ? <LoggedInHome /> : <LoggedOutHome />}
    </Container>
  );
};

const Login: React.FC = () => {
  const history = useHistory();
  const [, setToken] = useToken();
  const {
    handleSubmit,
    control,
    errors,
    formState: { isSubmitting, isValid },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
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
          const formData = new FormData();

          for (const key in data) {
            formData.append(key, (data as any)[key]);
          }

          const response = await fetch(
            `${process.env.REACT_APP_API_BASE}/auth/login`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (response.ok) {
            const body = await response.json();
            setToken(body.access_token);
            history.push("/");
          }
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
          disabled={isSubmitting || !isValid}
        >
          Submit
        </Button>
      </Grid>
    </Container>
  );
};

const Register: React.FC = () => {
  const history = useHistory();
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
          const response = await fetch(
            `${process.env.REACT_APP_API_BASE}/users`,
            {
              method: "POST",
              body: JSON.stringify({
                ...data,
                confirm: undefined,
                confirm_password: data.confirm,
              }),
            }
          );

          if (response.ok) {
            history.push("/login");
          }
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

const NotFound = () => {
  return (
    <Typography component="h4" variant="h4" align="center">
      Not Found
    </Typography>
  );
};

export const App = () => {
  return (
    <div id="app">
      <Header />
      <main>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/upload">
            <Upload />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </main>
    </div>
  );
};
