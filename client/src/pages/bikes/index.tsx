import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";
import BikeCard from "../../components/BikeCard";
import Filter from "../../components/Filter";
import { DELETE_BIKE } from "../../utils/mutations/bikes";
import { GET_BIKES } from "../../utils/quries/bikes";
import { useQueryMe } from "../../utils/quries/me";
import { Bike } from "../../utils/type";
import BikeModal from "./bikeModal";
import ReserveModal from "./reserveModal";
import CustomSnackbar, { CustomSnackbarProps } from "../../components/Snackbar";
import { parseErrorMessage } from "../../utils/common/helper";

export type ActionType = "add" | "update" | "reserve" | "cancel";

const date = new Date();
date.setDate(date.getDate() + 7);
const initialEndDate = date;

const Dashboard = () => {
  const [snackBarDetails, setSnackBar] = useState<CustomSnackbarProps>({});
  const [isOpenReserveModal, setIsOpenReserveModal] = useState(false);
  const [isOpenBikeModal, setIsOpenBikeModal] = useState(false);
  const [type, setType] = useState<ActionType>("reserve");
  const [currentBike, setCurrentBike] = useState<Bike>();
  const [start, setStart] = useState<Date | null>(new Date());
  const [end, setEnd] = useState<Date | null>(initialEndDate);
  const [filterModel, setFilterModel] = useState<Record<string, string>>({
    model: "",
    color: "",
    location: "",
    rate: "0",
    start_date: new Date().toISOString().split("T")[0],
    end_date: initialEndDate.toISOString().split("T")[0],
  });

  const { data: me } = useQueryMe();
  const { data, refetch } = useQuery(GET_BIKES, {
    variables: {
      filter: {
        ...filterModel,
      },
    },
  });

  const availableBikes = data?.bikes.availableBikes;
  const myBikes = data?.bikes.myBikes;

  const [removeBike] = useMutation(DELETE_BIKE, {
    onCompleted: (res) => {
      if (res.deleteBike._id) {
        setSnackBar({
          open: true,
          message: "Successfully deleted",
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

  useEffect(() => {
    if (refetch) {
      refetch({
        filter: {
          ...filterModel,
        },
      });
    }
  }, [filterModel, refetch]);

  const handleStartChange = (newValue: Date | null) => {
    setStart(newValue);
    if (newValue) {
      const newFilter = { ...filterModel };
      newFilter["start_date"] = newValue.toISOString().split("T")[0];
      setFilterModel(newFilter);
    }
    if (newValue && end && newValue > end) {
      setEnd(newValue);
    }
  };

  const handleEndChange = (newValue: Date | null) => {
    setEnd(newValue);
    if (newValue) {
      const newFilter = { ...filterModel };
      newFilter["end_date"] = newValue.toISOString().split("T")[0];
      setFilterModel(newFilter);
    }
  };

  const filterChange = (key: string, value: string) => {
    const newFilter = { ...filterModel };
    newFilter[key] = value;
    setFilterModel(newFilter);
  };

  const remove = async (id: string) => {
    await removeBike({
      variables: {
        id,
      },
    });
  };

  return (
    <Box py={3} px={6} display="flex" sx={{ flexGrow: 1 }}>
      <Box sx={{ minWidth: 300 }}>
        <Filter filterChange={filterChange} model={filterModel} />
      </Box>
      {me?.role === "manager" ? (
        <Box sx={{ flex: 1 }}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h4">All bikes</Typography>
            <Button
              variant="contained"
              onClick={() => {
                setType("add");
                setIsOpenBikeModal(true);
              }}
            >
              Add Bike
            </Button>
          </Box>
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {availableBikes &&
              availableBikes.map((bike: Bike) => (
                <Box m={2} key={bike._id}>
                  <BikeCard
                    type="available"
                    user={me}
                    bike={bike}
                    edit={() => {
                      setIsOpenBikeModal(true);
                      setType("update");
                      setCurrentBike(bike);
                    }}
                    remove={() => remove(bike._id)}
                  />
                </Box>
              ))}
          </Box>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4">My bikes</Typography>
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {myBikes &&
                myBikes.map((bike: Bike) => (
                  <Box m={2} key={bike._id}>
                    <BikeCard
                      type="reserved"
                      user={me}
                      bike={bike}
                      cancelReserve={() => {
                        setIsOpenReserveModal(true);
                        setType("cancel");
                        setCurrentBike(bike);
                      }}
                    />
                  </Box>
                ))}
            </Box>
          </Box>

          <Box sx={{ flex: 1 }} mt={5}>
            <Typography variant="h4">Available bikes</Typography>
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            <Box display="flex">
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
                    minDate={start ?? new Date()}
                    onChange={handleEndChange}
                    renderInput={(params: any) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {availableBikes &&
                availableBikes.map((bike: Bike) => (
                  <Box m={2} key={bike._id}>
                    <BikeCard
                      type="available"
                      user={me}
                      bike={bike}
                      reserve={() => {
                        setIsOpenReserveModal(true);
                        setType("reserve");
                        setCurrentBike(bike);
                      }}
                    />
                  </Box>
                ))}
            </Box>
          </Box>
        </Box>
      )}
      <ReserveModal
        type={type}
        open={isOpenReserveModal}
        onClose={() => setIsOpenReserveModal(false)}
        bikeId={currentBike?._id}
      />
      <BikeModal
        type={type}
        open={isOpenBikeModal}
        onClose={() => {
          setIsOpenBikeModal(false);
          setCurrentBike(undefined);
        }}
        bike={currentBike}
      />
      <CustomSnackbar
        {...snackBarDetails}
        onClose={() => setSnackBar({ open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default Dashboard;
