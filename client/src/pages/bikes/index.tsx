import { useMutation, useQuery } from "@apollo/client";
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

export type ActionType = "add" | "update" | "reserve" | "cancel";

const Dashboard = () => {
  const [isOpenReserveModal, setIsOpenReserveModal] = useState(false);
  const [isOpenBikeModal, setIsOpenBikeModal] = useState(false);
  const [type, setType] = useState<ActionType>("reserve");
  const [currentBike, setCurrentBike] = useState<Bike>();
  const [start, setStart] = useState<Date | null>(new Date());
  const [end, setEnd] = useState<Date | null>(() => {
    var date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
  });
  const [filterModel, setFilterModel] = useState<Record<string, string>>({
    model: "",
    color: "",
    location: "",
    rate: "0",
  });

  const { data: me } = useQueryMe();
  const { data, refetch } = useQuery(GET_BIKES);

  const bikes = data?.bikes;
  const myBikes = data?.bikes.filter(
    (bike: Bike) => bike.reserved_user_id === me?.id && bike.reserved
  );

  const [removeBike] = useMutation(DELETE_BIKE, {
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
  };
  const handleEndChange = (newValue: Date | null) => {
    setEnd(newValue);
  };

  const filterChange = (key: string, value: string) => {
    const newFilter = { ...filterModel };
    newFilter[key] = value;
    setFilterModel(newFilter);
  };

  const remove = async (id: string) => {
    try {
      await removeBike({
        variables: {
          id,
        },
      });
    } catch (error) {
      console.log(error);
    }
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
            {bikes &&
              bikes.map((bike: Bike) => (
                <Box m={2} key={bike.id}>
                  <BikeCard
                    user={me}
                    bike={bike}
                    edit={() => {
                      setIsOpenBikeModal(true);
                      setType("update");
                      setCurrentBike(bike);
                    }}
                    remove={() => remove(bike.id)}
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
                  <Box m={2} key={bike.id}>
                    <BikeCard
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
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {bikes &&
                bikes
                  .filter((bike: Bike) => !bike.reserved)
                  .map((bike: Bike) => (
                    <Box m={2} key={bike.id}>
                      <BikeCard
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
        bikeId={currentBike?.id}
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
    </Box>
  );
};

export default Dashboard;
