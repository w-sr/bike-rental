import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import CustomSnackbar, { CustomSnackbarProps } from "../../components/Snackbar";
import { parseErrorMessage } from "../../graphql/helper";
import { CREATE_BIKE, UPDATE_BIKE } from "../../graphql/mutations/bikes";
import { GET_BIKE, GET_BIKES } from "../../graphql/quries/bikes";
import { Bike } from "../../graphql/type";

type Props = {
  onClose: () => void;
  open: boolean;
  type: string;
  bike?: Bike;
  startDate?: string;
  endDate?: string;
};

const initialValues = {
  model: "",
  color: "",
  location: "",
  rate: "0",
};

const FormSchema = Yup.object().shape({
  model: Yup.string()
    .required("Model is required")
    .matches(
      /^[a-zA-Z0-9 ]*$/,
      "Only alphabets and numbers are allowed for model"
    ),
  color: Yup.string().required("Color is required"),
  location: Yup.string()
    .required("Location is required")
    .matches(/^[aA-zZ \s]+$/, "Only alphabets are allowed for location"),
});

const BikeModal = ({
  onClose,
  open,
  type,
  bike,
  startDate,
  endDate,
}: Props) => {
  const [snackBarDetails, setSnackBar] = useState<CustomSnackbarProps>({});

  const formik = useFormik({
    initialValues: bike ? bike : initialValues,
    validationSchema: FormSchema,
    onSubmit: async (values) => {
      if (type === "update") {
        const variables = {
          input: {
            model: values.model.trim(),
            color: values.color.trim(),
            location: values.location.trim(),
          },
          id: bike?._id,
        };
        await updateBike({ variables });
      } else if (type === "add") {
        const variables = {
          input: {
            model: values.model.trim(),
            color: values.color.trim(),
            location: values.location.trim(),
          },
        };
        await createBike({ variables });
      }
    },
  });

  const { values, setFieldValue, touched, errors } = formik;

  const [getBike, { data }] = useLazyQuery(GET_BIKE);

  console.log(data);
  const [updateBike] = useMutation(UPDATE_BIKE, {
    onCompleted: (res) => {
      if (res.updateBike) {
        onClose();
        setSnackBar({
          open: true,
          message: "Successfully updated",
          onClose: () => setSnackBar({}),
          severity: "success",
        });
      }
    },
    onError: (error) => {
      const errorMessage = parseErrorMessage(error);
      setSnackBar({
        open: true,
        message: errorMessage,
        onClose: () => setSnackBar({}),
        severity: "error",
      });
    },
    refetchQueries: [GET_BIKES],
  });

  const [createBike] = useMutation(CREATE_BIKE, {
    onCompleted: (res) => {
      if (res.createBike) {
        onClose();
        setSnackBar({
          open: true,
          message: "Successfully created",
          onClose: () => setSnackBar({}),
          severity: "success",
        });
      }
    },
    onError: (error) => {
      const errorMessage = parseErrorMessage(error);
      setSnackBar({
        open: true,
        message: errorMessage,
        onClose: () => setSnackBar({ severity: "error" }),
        severity: "error",
      });
    },
    refetchQueries: [GET_BIKES],
  });

  useEffect(() => {
    const values = bike ? { ...bike } : { ...initialValues };
    formik.resetForm({
      values,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bike]);

  useEffect(() => {
    if (open && type === "update") {
      getBike({
        variables: {
          input: {
            id: bike?._id,
            start_date: startDate,
            end_date: endDate,
          },
        },
      });
    }
  }, [open, startDate, endDate, getBike, bike, type]);

  const resetForm = () => formik.resetForm();

  const modalClose = () => {
    resetForm();
    onClose();
  };

  const renderTitle = () => (type === "add" ? "Add Bike" : "Update Bike");

  const renderHandleButton = () => (type === "add" ? "Add" : "Update");

  return (
    <>
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
              <Box my={2}>
                <FormGroup>
                  <FormControlLabel
                    disabled
                    control={<Checkbox checked={data?.bike.available} />}
                    label={
                      data?.bike.available
                        ? "Available for rental"
                        : "Unavailable for rental"
                    }
                  />
                </FormGroup>
              </Box>
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
      <CustomSnackbar
        {...snackBarDetails}
        onClose={() => setSnackBar({ open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

export default BikeModal;
