import { useQuery } from "@apollo/client";
import { Box, Button, TextField, Typography, Rating } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useCallback, useEffect, useMemo, useState } from "react";
import Filter from "../../components/Filter";
import CustomSnackbar, { CustomSnackbarProps } from "../../components/Snackbar";
import { GET_BIKES } from "../../graphql/quries/bikes";
import { Bike } from "../../graphql/type";
import { dateIsValid } from "../../utils/common";
import ReserveModal from "./reserveModal";

export type ActionType = "add" | "update" | "reserve" | "cancel";

const date = new Date();
date.setDate(date.getDate() + 7);
const initialEndDate = date;

const AvailableBikesPage = () => {
  const [snackBarDetails, setSnackBar] = useState<CustomSnackbarProps>({});
  const [isOpenReserveModal, setIsOpenReserveModal] = useState(false);
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

  const { data, loading, refetch } = useQuery(GET_BIKES, {
    variables: {
      filter: {
        ...filterModel,
      },
    },
  });

  const bikes = useMemo(() => data?.bikes || [], [data]);

  useEffect(() => {
    if (refetch) {
      refetch({
        filter: {
          ...filterModel,
        },
      });
    }
  }, [filterModel, refetch]);

  const handleStartChange = useCallback(
    (newValue: Date | null) => {
      setStart(newValue);
      if (newValue && dateIsValid(newValue)) {
        const newFilter = { ...filterModel };
        newFilter["start_date"] = newValue.toISOString().split("T")[0];
        if (newFilter["start_date"] > newFilter["end_date"]) {
          newFilter["end_date"] = newFilter["start_date"];
          setEnd(newValue);
        }
        setFilterModel(newFilter);
      }
    },
    [filterModel]
  );

  const handleEndChange = useCallback(
    (newValue: Date | null) => {
      setEnd(newValue);
      if (newValue && dateIsValid(newValue)) {
        const newFilter = { ...filterModel };
        newFilter["end_date"] = newValue.toISOString().split("T")[0];
        setFilterModel(newFilter);
      }
    },
    [filterModel]
  );

  const handleReserve = useCallback(
    (params: GridRowParams) => {
      setIsOpenReserveModal(true);
      setType("reserve");
      setCurrentBike(bikes?.find((b: Bike) => b._id === params.id));
    },
    [bikes]
  );

  const filterChange = useCallback(
    (key: string, value: string) => {
      const newFilter = { ...filterModel };
      newFilter[key] = value;
      setFilterModel(newFilter);
    },
    [filterModel]
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "model",
        headerName: "Model",
        sortable: true,
        flex: 1,
      },
      {
        field: "color",
        headerName: "Color",
        sortable: true,
        flex: 1,
      },
      {
        field: "location",
        headerName: "Location",
        sortable: true,
        flex: 1,
      },
      {
        field: "rate",
        headerName: "Rate",
        sortable: true,
        flex: 1,
        renderCell: (params: GridRenderCellParams<string>) => (
          <Rating
            name="rate"
            value={parseFloat(params.value ?? "0")}
            readOnly
          />
        ),
      },
      {
        field: "actions",
        type: "actions",
        sortable: false,
        flex: 1,
        getActions: (params: GridRowParams) => [
          <Button variant="outlined" onClick={() => handleReserve(params)}>
            Reserve
          </Button>,
        ],
      },
    ],
    [handleReserve]
  );

  return (
    <Box flexGrow={1} mx={5} mt={5}>
      <Box display="flex" my={2}>
        <Filter filterChange={filterChange} model={filterModel} />
        <Box display="flex">
          <Box mx={1}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Start Date"
                inputFormat="MM/dd/yyyy"
                value={start}
                minDate={new Date()}
                onChange={handleStartChange}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    helperText={params.error ? "Search from today" : ""}
                  />
                )}
              />
            </LocalizationProvider>
          </Box>
          <Box mx={1}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="End Date"
                inputFormat="MM/dd/yyyy"
                value={end}
                minDate={start ?? new Date()}
                onChange={handleEndChange}
                renderInput={(params: any) => {
                  return <TextField {...params} />;
                }}
              />
            </LocalizationProvider>
          </Box>
        </Box>
      </Box>

      <Box sx={{ height: 650, flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h5">Bikes</Typography>
        </Box>
        {loading ? (
          <CircularProgress />
        ) : (
          <DataGrid
            rows={
              bikes?.map((bike: Bike) => ({
                ...bike,
                id: bike._id,
              })) || []
            }
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
          />
        )}
      </Box>
      <ReserveModal
        type={type}
        open={isOpenReserveModal}
        startDate={start}
        endDate={end}
        onClose={() => setIsOpenReserveModal(false)}
        bikeId={currentBike?._id}
      />
      <CustomSnackbar
        {...snackBarDetails}
        onClose={() => setSnackBar({ open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default AvailableBikesPage;
