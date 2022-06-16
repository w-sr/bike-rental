import { Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { styled } from "@mui/system";
import { useMutation } from "@apollo/client";
import { REGISTER } from "../../utils/mutations/auth";

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

  const FormSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid Email").required("Email is required"),
    password: Yup.string()
      .required("Name is required")
      .min(8, "Password should be at least 8 letters"),
  });

  const [registerUser] = useMutation(REGISTER);

  const formik = useFormik({
    initialValues,
    validationSchema: FormSchema,
    onSubmit: async (values) => {
      const res = await registerUser({
        variables: {
          data: {
            ...values,
          },
        },
      });
      if (res.data.register) {
        localStorage.setItem("token", res.data.register.token);
        navigate("/bikes");
      }
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
