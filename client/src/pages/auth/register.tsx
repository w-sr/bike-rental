import { Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { styled } from "@mui/system";
import { useMutation } from "@apollo/client";
import { REGISTER } from "../../utils/mutations/auth";
import { useState } from "react";
import { parseErrorMessage } from "../../utils/common/helper";

const StyledLink = styled(Link)({
  fontSize: "0.75rem",
});

const initialValues = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
};

const Register = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const FormSchema = Yup.object().shape({
    first_name: Yup.string()
      .required("First name is required")
      .matches(/^[a-zA-Z]*$/, "Only alphabets are allowed for first name"),
    last_name: Yup.string()
      .required("Last name is required")
      .matches(/^[a-zA-Z]*$/, "Only alphabets are allowed for last name"),
    email: Yup.string().email("Invalid Email").required("Email is required"),
    password: Yup.string()
      .required("Name is required")
      .min(8, "Password should be at least 8 letters"),
  });

  const [registerUser] = useMutation(REGISTER, {
    onCompleted: (res) => {
      if (res.register) {
        localStorage.setItem("token", res.register.token);
        navigate("/bikes");
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
      registerUser({
        variables: {
          data: {
            ...values,
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
        Register
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
            id="first_name"
            name="first_name"
            label="First name"
            value={values.first_name}
            onChange={(e) => setFieldValue("first_name", e.target.value)}
            error={touched.first_name && Boolean(errors.first_name)}
            helperText={touched.first_name && errors.first_name}
          />
        </Box>
        <Box my={2}>
          <TextField
            fullWidth
            id="last_name"
            name="last_name"
            label="Last name"
            value={values.last_name}
            onChange={(e) => setFieldValue("last_name", e.target.value)}
            error={touched.last_name && Boolean(errors.last_name)}
            helperText={touched.last_name && errors.last_name}
          />
        </Box>
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
            onChange={(e) => setFieldValue("password", e.target.value)}
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
          <StyledLink to="/login">Already have an account?</StyledLink>
          <Button variant="contained" type="submit" sx={{ marginLeft: 2 }}>
            Register
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Register;
