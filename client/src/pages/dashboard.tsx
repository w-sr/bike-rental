import { useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";
import BikeCard from "../components/BikeCard";
import Filter from "../components/Filter";
import { CREATE_RESERVATION } from "../utils/mutations/reservations";
import { GET_BIKES } from "../utils/quries/bikes";
import { useQueryMe } from "../utils/quries/me";
import { useQueryReservations } from "../utils/quries/reservations";
import { Bike } from "../utils/type";

const Dashboard = () => {
  const [modal, setModal] = useState(false);

  const [filterModel, setFilterModel] = useState<Record<string, string>>({
    model: "",
    color: "",
    location: "",
    rate: "0",
  });

  const [start, setStart] = useState<Date | null>(new Date());
  const [end, setEnd] = useState<Date | null>(new Date());
  const [bikeId, setBikeId] = useState<string>();
  const handleStartChange = (newValue: Date | null) => {
    setStart(newValue);
  };
  const handleEndChange = (newValue: Date | null) => {
    setEnd(newValue);
  };

  const { data: me } = useQueryMe();
  const { data, loading: bikesLoading, refetch } = useQuery(GET_BIKES);
  const bikes = data?.bikes;
  const { data: reservations, loading: reservationsLoading } =
    useQueryReservations();

  const [reserveBike] = useMutation(CREATE_RESERVATION);

  const filterChange = (key: string, value: string) => {
    const newFilter = { ...filterModel };
    newFilter[key] = value;
    setFilterModel(newFilter);
  };

  useEffect(() => {
    if (refetch) {
      refetch({
        filter: {
          ...filterModel,
        },
      });
    }
  }, [filterModel, refetch]);

  const onSetRate = (rate: number) => console.log("onSetRate", rate);

  const onReserve = async () => {
    try {
      const res = await reserveBike({
        variables: {
          input: {
            user: me?.id,
            bike: bikeId,
            start_date: start?.toISOString().split("T")[0],
            end_date: end?.toISOString().split("T")[0],
          },
        },
      });
      if (res.data.createReservation) {
        setModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onCancelReserve = () => console.log("onSetRate");

  return (
    <Box py={3} px={6} display="flex" sx={{ flexGrow: 1 }}>
      <Box sx={{ width: 480 }}>
        <Filter filterChange={filterChange} model={filterModel} />
      </Box>
      <Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4">My bikes</Typography>
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
          <Box sx={{ display: "flex", flexWrap: "wrap" }}></Box>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h4">Available bikes</Typography>
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {bikes &&
              bikes
                .filter((bike: Bike) => !bike.rented)
                .map((bike: Bike) => (
                  <Box m={2} key={bike.id}>
                    <BikeCard
                      bike={bike}
                      setRate={onSetRate}
                      reserve={() => {
                        setModal(true);
                        setBikeId(bike.id);
                      }}
                      cancelReserve={onCancelReserve}
                    />
                  </Box>
                ))}
          </Box>
        </Box>
      </Box>

      <Dialog
        open={modal}
        sx={{ "& .MuiDialog-paper": { minWidth: 500 } }}
        maxWidth="xs"
        aria-labelledby="add-fodd-dialog"
      >
        <DialogTitle>Reserve</DialogTitle>
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
        <DialogActions>
          <Box mt={5} display="flex" justifyContent="flex-end">
            <Button
              onClick={() => setModal(false)}
              autoFocus
              sx={{ marginRight: 2 }}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={onReserve}>
              Reserve
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
