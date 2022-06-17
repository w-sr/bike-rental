import { useMutation } from "@apollo/client";
import { Box, Button, TextField, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useFormik } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { parseErrorMessage } from "../../utils/common/helper";
import { LOGIN } from "../../utils/mutations/auth";

const StyledLink = styled(Link)({
  fontSize: "0.75rem",
});

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  const FormSchema = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const [login] = useMutation(LOGIN, {
    onCompleted: (res) => {
      localStorage.setItem("token", res.login.token);
      if (res.login.user.role === "user") {
        navigate("/bikes");
      } else {
        navigate("/dashboard");
      }
    },
    onError: (err) => {
      setErrorMessage(parseErrorMessage(err));
    },
  });

  const formik = useFormik({
    initialValues,
    validationSchema: FormSchema,
    onSubmit: async (values) => {
      await login({
        variables: {
          data: {
            email: values.email,
            password: values.password,
          },
        },
      });
    },
  });

  const { values, setFieldValue, touched, errors } = formik;

  return (
    <Box
      sx={{
        boxShadow: 3,
        width: 500,
        margin: "50px auto",
        padding: 3,
      }}
    >
      <Typography variant="h4" component="div" sx={{ marginBottom: 4 }}>
        Login
      </Typography>
      <Box minHeight={30}>
        {errorMessage && (
          <Typography
            variant="subtitle2"
            sx={{ color: "red", marginBottom: 2 }}
            textAlign="center"
          >
            {errorMessage}
          </Typography>
        )}
      </Box>
      <form onSubmit={formik.handleSubmit}>
        <Box my={2}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={values.email}
            onChange={(e) => {
              setErrorMessage("");
              setFieldValue("email", e.target.value);
            }}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
          />
        </Box>
        <Box my={2}>
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={values.password}
            onChange={(e) => {
              setErrorMessage("");
              setFieldValue("password", e.target.value);
            }}
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
          />
        </Box>
        <Box
          mt={4}
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
        >
          <StyledLink to="/register">Don't you have an account?</StyledLink>
          <Button variant="contained" type="submit" sx={{ marginLeft: 2 }}>
            Login
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Login;
