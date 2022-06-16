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
import { GET_BIKES } from "../../utils/quries/bikes";
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
  rate: 0,
  reserved: false,
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
      try {
        if (type === "update") {
          const variables = {
            input: {
              model: values.model,
              color: values.color,
              location: values.location,
              rate: values.rate,
              reserved: values.reserved,
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
        onClose();
      } catch (error) {
        console.log(error);
      }
    },
  });

  const { values, setFieldValue, touched, errors } = formik;

  const [updateBike] = useMutation(UPDATE_BIKE, {
    refetchQueries: [GET_BIKES],
  });
  const [createBike] = useMutation(CREATE_BIKE, {
    refetchQueries: [GET_BIKES],
  });

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

  const renderTitle = () => (type === "add" ? "Add Bike" : "Update Bike");

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
          {type === "update" && (
            <>
              <Box my={2}>
                <TextField
                  fullWidth
                  id="rate"
                  name="rate"
                  label="Rating"
                  type="number"
                  value={values.rate}
                  onChange={(e) => setFieldValue("rate", e.target.value)}
                  error={touched.rate && Boolean(errors.rate)}
                  helperText={touched.rate && errors.rate}
                />
              </Box>
              <Box my={2}>
                <TextField
                  fullWidth
                  id="reserved"
                  name="reserved"
                  label="reserved"
                  value={values.reserved}
                  onChange={(e) => setFieldValue("reserved", e.target.value)}
                  error={touched.reserved && Boolean(errors.reserved)}
                  helperText={touched.reserved && errors.reserved}
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
