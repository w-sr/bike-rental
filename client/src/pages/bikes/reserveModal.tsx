import { useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useCallback, useEffect, useState } from "react";
import { ActionType } from ".";
import CustomSnackbar, { CustomSnackbarProps } from "../../components/Snackbar";
import { parseErrorMessage } from "../../graphql/helper";
import {
  CANCEL_RESERVATION,
  CREATE_RESERVATION,
} from "../../graphql/mutations/reservations";
import { GET_BIKES } from "../../graphql/quries/bikes";
import { useQueryMe } from "../../graphql/quries/me";
import { dateIsValid } from "../../utils/common";

type ModalProps = {
  type: ActionType;
  open: boolean;
  startDate: Date | null;
  endDate: Date | null;
  onClose: () => void;
  bikeId?: string;
};

const ReserveModal = ({
  open,
  onClose,
  bikeId,
  type,
  startDate,
  endDate,
}: ModalProps) => {
  const [snackBarDetails, setSnackBar] = useState<CustomSnackbarProps>({});
  const [value, setValue] = useState<number | null>(0);
  const [start, setStart] = useState<Date | null>(
    startDate ? new Date(startDate) : new Date()
  );
  const [end, setEnd] = useState<Date | null>(() => {
    var date = new Date();
    date.setDate(date.getDate() + 7);
    return endDate ? endDate : date;
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { data: me } = useQueryMe();

  useEffect(() => {
    if (startDate) setStart(startDate);
    if (endDate) setEnd(endDate);
  }, [startDate, endDate]);

  const handleStartChange = useCallback((newValue: Date | null) => {
    setStart(newValue);
    setErrorMessage("");
  }, []);

  const handleEndChange = useCallback((newValue: Date | null) => {
    setEnd(newValue);
    setErrorMessage("");
  }, []);

  const [reserveBike] = useMutation(CREATE_RESERVATION, {
    onCompleted: (res) => {
      if (res.createReservation) {
        modalClose();
        setSnackBar({
          open: true,
          message: "Successfully reserved",
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

  const [cancelReserve] = useMutation(CANCEL_RESERVATION, {
    onCompleted: (res) => {
      if (res.cancelReservation) {
        modalClose();
        setSnackBar({
          open: true,
          message: "Successfully cancelled",
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

  const handleSubmit = async () => {
    if (!bikeId) return;
    if (type === "reserve") {
      if (!validateDates()) return;
      await reserveBike({
        variables: {
          input: {
            bike: bikeId,
            start_date: start?.toISOString().split("T")[0],
            end_date: end?.toISOString().split("T")[0],
          },
        },
      });
    } else if (type === "cancel") {
      await cancelReserve({
        variables: {
          input: {
            user: me?._id,
            bike: bikeId,
            rate: value?.toString(),
          },
        },
      });
    }
  };

  const validateDates = () => {
    if (!start || !end) {
      setErrorMessage("Please input valid dates");
      return false;
    }
    if (!dateIsValid(new Date(start)) || !dateIsValid(new Date(end))) {
      setErrorMessage("Please input valid dates");
      return false;
    }
    if (start.toISOString().split("T")[0] > end.toISOString().split("T")[0]) {
      setErrorMessage("End date should be greater than start date");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const modalClose = () => {
    setErrorMessage("");
    onClose();
    setValue(0);
  };

  const renderTitle = () => (type === "cancel" ? "Cancel reserve" : "Reserve");

  const renderHandleButton = () =>
    type === "cancel" ? "Cancel reserve" : "Reserve";

  return (
    <>
      <Dialog
        open={open}
        sx={{ "& .MuiDialog-paper": { minWidth: 500 } }}
        maxWidth="xs"
        aria-labelledby="add-fodd-dialog"
      >
        <DialogTitle>{renderTitle()}</DialogTitle>
        {type === "cancel" ? (
          <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
            <Rating
              name="rating"
              value={value}
              onChange={(_, newValue) => setValue(newValue)}
            />
          </DialogContent>
        ) : (
          <DialogContent>
            <Box m={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="Start Date"
                  inputFormat="MM/dd/yyyy"
                  value={start}
                  minDate={new Date()}
                  onChange={handleStartChange}
                  renderInput={(params: any) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>
            <Box m={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="End Date"
                  inputFormat="MM/dd/yyyy"
                  value={end}
                  minDate={new Date()}
                  onChange={handleEndChange}
                  renderInput={(params: any) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>
            {errorMessage && (
              <Box m={2}>
                <Typography variant="subtitle1" sx={{ color: "#d32f2f" }}>
                  {errorMessage}
                </Typography>
              </Box>
            )}
          </DialogContent>
        )}
        <DialogActions>
          <Box mt={5} display="flex" justifyContent="flex-end">
            <Button onClick={modalClose} autoFocus sx={{ marginRight: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              {renderHandleButton()}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
      <CustomSnackbar
        {...snackBarDetails}
        onClose={() => setSnackBar({ open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

export default ReserveModal;
