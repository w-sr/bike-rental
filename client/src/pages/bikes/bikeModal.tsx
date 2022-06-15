import { useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";
import { CREATE_BIKE, UPDATE_BIKE } from "../../utils/mutations/bikes";
import { Bike } from "../../utils/type";

type Props = {
  onClose: () => void;
  open: boolean;
  type: string;
  bike?: Bike;
};

const initialValues = {
  model: "",
  color: "",
  location: "",
  rating: 0,
  rented: false,
};

const BikeModal = ({ onClose, open, type, bike }: Props) => {
  const FormSchema = Yup.object().shape({
    model: Yup.string().required("Model is required"),
    color: Yup.string().required("Color is required"),
    location: Yup.string().required("Location is required"),
  });

  const formik = useFormik({
    initialValues: bike ? bike : initialValues,
    validationSchema: FormSchema,
    onSubmit: async (values) => {
      if (type === "edit") {
        const variables = {
          input: {
            model: values.model,
            color: values.color,
            location: values.location,
            rating: values.rating,
            rented: values.rented,
          },
          id: bike?.id,
        };
        await updateBike({ variables });
      } else if (type === "add") {
        const variables = {
          input: {
            model: values.model,
            color: values.color,
            location: values.location,
          },
        };
        await createBike({ variables });
      }
    },
  });

  const { values, setFieldValue, touched, errors } = formik;

  const [updateBike] = useMutation(UPDATE_BIKE);
  const [createBike] = useMutation(CREATE_BIKE);

  useEffect(() => {
    const values = bike ? { ...bike } : { ...initialValues };
    formik.resetForm({
      values,
    });
  }, [bike]);

  const resetForm = () => formik.resetForm();

  const modalClose = () => {
    resetForm();
    onClose();
  };

  const renderTitle = () => (type === "add" ? "Add Bike" : "Edit Bike");

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
              id="model"
              name="model"
              label="Model"
              value={values.model}
              onChange={(e) => setFieldValue("model", e.target.value)}
              error={touched.model && Boolean(errors.model)}
              helperText={touched.model && errors.model}
            />
          </Box>
          <Box my={2}>
            <TextField
              fullWidth
              id="color"
              name="color"
              label="Color"
              value={values.color}
              onChange={(e) => setFieldValue("color", e.target.value)}
              error={touched.color && Boolean(errors.color)}
              helperText={touched.color && errors.color}
            />
          </Box>
          <Box my={2}>
            <TextField
              fullWidth
              id="location"
              name="location"
              label="Location"
              value={values.location}
              onChange={(e) => setFieldValue("location", e.target.value)}
              error={touched.location && Boolean(errors.location)}
              helperText={touched.location && errors.location}
            />
          </Box>
          {type === "edit" && (
            <>
              <Box my={2}>
                <TextField
                  fullWidth
                  id="rating"
                  name="rating"
                  label="Rating"
                  type="number"
                  value={values.rating}
                  onChange={(e) => setFieldValue("rating", e.target.value)}
                  error={touched.rating && Boolean(errors.rating)}
                  helperText={touched.rating && errors.rating}
                />
              </Box>
              <Box my={2}>
                <TextField
                  fullWidth
                  id="rented"
                  name="rented"
                  label="Rented"
                  value={values.rented}
                  onChange={(e) => setFieldValue("rented", e.target.value)}
                  error={touched.rented && Boolean(errors.rented)}
                  helperText={touched.rented && errors.rented}
                />
              </Box>
            </>
          )}
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

export default BikeModal;
