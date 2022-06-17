import { useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";
import { ActionType } from ".";
import CustomSnackbar, { CustomSnackbarProps } from "../../components/Snackbar";
import { parseErrorMessage } from "../../utils/common/helper";
import {
  CANCEL_RESERVATION,
  CREATE_RESERVATION,
} from "../../utils/mutations/reservations";
import { GET_BIKES } from "../../utils/quries/bikes";
import { useQueryMe } from "../../utils/quries/me";

type ModalProps = {
  type: ActionType;
  open: boolean;
  onClose: () => void;
  bikeId?: string;
};

const ReserveModal = ({ open, onClose, bikeId, type }: ModalProps) => {
  const [snackBarDetails, setSnackBar] = useState<CustomSnackbarProps>({});
  const [value, setValue] = useState<number | null>(0);
  const [start, setStart] = useState<Date | null>(new Date());
  const [end, setEnd] = useState<Date | null>(() => {
    var date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
  });
  const handleStartChange = (newValue: Date | null) => {
    setStart(newValue);
  };
  const handleEndChange = (newValue: Date | null) => {
    setEnd(newValue);
  };

  const { data: me } = useQueryMe();

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
      await reserveBike({
        variables: {
          input: {
            user: me?._id,
            bike: bikeId,
            start_date: start?.toISOString().split("T")[0],
            end_date: end?.toISOString().split("T")[0],
          },
        },
      });
    } else if (type === "cancel") {
      console.log("xxx");
      await cancelReserve({
        variables: {
          id: bikeId,
          rate: value?.toString(),
        },
      });
    }
  };

  const modalClose = () => {
    onClose();
    setValue(0);
  };

  return (
    <>
      <Dialog
        open={open}
        sx={{ "& .MuiDialog-paper": { minWidth: 500 } }}
        maxWidth="xs"
        aria-labelledby="add-fodd-dialog"
      >
        <DialogTitle>
          {type === "cancel" ? "Cancel reserve" : "Reserve"}
        </DialogTitle>
        {type === "cancel" ? (
          <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
            <Rating
              name="simple-controlled"
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
                  onChange={handleEndChange}
                  renderInput={(params: any) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>
          </DialogContent>
        )}
        <DialogActions>
          <Box mt={5} display="flex" justifyContent="flex-end">
            <Button onClick={modalClose} autoFocus sx={{ marginRight: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              {type === "cancel" ? "Cancel reserve" : "Reserve"}
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
