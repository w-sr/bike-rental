import { Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { styled } from "@mui/system";

const StyledLink = styled(Link)({
  fontSize: "0.75rem",
});

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

const Register = () => {
  const FormSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid Email").required("Email is required"),
    password: Yup.string()
      .required("Name is required")
      .min(8, "Password should be at least 8 letters"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: FormSchema,
    onSubmit: (values) => {
      alert(values);
    },
  });

  const { values, setFieldValue, touched, errors, handleSubmit } = formik;

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
      <form onSubmit={formik.handleSubmit}>
        <Box my={2}>
          <TextField
            fullWidth
            id="firstName"
            name="firstName"
            label="First name"
            value={values.firstName}
            onChange={(e) => setFieldValue("firstName", e.target.value)}
            error={touched.firstName && Boolean(errors.firstName)}
            helperText={touched.firstName && errors.firstName}
          />
        </Box>
        <Box my={2}>
          <TextField
            fullWidth
            id="lastName"
            name="lastName"
            label="Last name"
            value={values.lastName}
            onChange={(e) => setFieldValue("lastName", e.target.value)}
            error={touched.lastName && Boolean(errors.lastName)}
            helperText={touched.lastName && errors.lastName}
          />
        </Box>
        <Box my={2}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={values.email}
            onChange={(e) => setFieldValue("email", e.target.value)}
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
