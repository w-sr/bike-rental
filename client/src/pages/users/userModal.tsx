import { useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";
import { CREATE_USER, UPDATE_USER } from "../../utils/mutations/users";
import { User } from "../../utils/type";
type Props = {
  onClose: () => void;
  open: boolean;
  type: string;
  user?: User;
};

const initialValues = {
  first_name: "",
  last_name: "",
  email: "",
  role: "manager",
};

const UserModal = ({ onClose, open, type, user }: Props) => {
  const FormSchema = Yup.object().shape({
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid Email").required("Email is required"),
    role: Yup.string().required("Role is required"),
  });

  const formik = useFormik({
    initialValues: user ? user : initialValues,
    validationSchema: FormSchema,
    onSubmit: async (values) => {
      try {
        if (type === "edit") {
          const variables = {
            input: {
              first_name: values.first_name,
              last_name: values.last_name,
              email: values.email,
              role: values.role,
            },
            id: user?.id,
          };
          const res = await updateUser({ variables });
          if (res.data.updateUser) {
            onClose();
          }
        } else if (type === "add") {
          const variables = {
            input: {
              first_name: values.first_name,
              last_name: values.last_name,
              email: values.email,
              role: values.role,
            },
          };
          const res = await createUser({ variables });
          if (res.data.createUser) {
            onClose();
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  const { values, setFieldValue, touched, errors } = formik;

  const [updateUser] = useMutation(UPDATE_USER);
  const [createUser] = useMutation(CREATE_USER);

  useEffect(() => {
    const values = user ? { ...user } : { ...initialValues };
    formik.resetForm({
      values,
    });
  }, [user]);

  const resetForm = () => formik.resetForm();

  const modalClose = () => {
    resetForm();
    onClose();
  };

  const renderTitle = () => (type === "add" ? "Add User" : "Edit User");

  const renderHandleButton = () => (type === "add" ? "Add" : "Update");

  return (
    <Dialog
      open={open}
      sx={{ "& .MuiDialog-paper": { minWidth: 500 } }}
      maxWidth="xs"
      aria-labelledby="add-fodd-dialog"
    >
      <DialogTitle>{renderTitle()}</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Box my={2}>
            <TextField
              fullWidth
              id="first_name"
              name="first_name"
              label="First Name"
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
              label="Last Name"
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
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Role
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={values.role}
                onChange={(e) => setFieldValue("role", e.target.value)}
              >
                <FormControlLabel
                  value="manager"
                  control={<Radio />}
                  label="Manager"
                />
                <FormControlLabel
                  value="user"
                  control={<Radio />}
                  label="User"
                />
              </RadioGroup>
            </FormControl>
          </Box>
          <Box mt={5} display="flex" justifyContent="flex-end">
            <Button onClick={modalClose} autoFocus sx={{ marginRight: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              {renderHandleButton()}
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
