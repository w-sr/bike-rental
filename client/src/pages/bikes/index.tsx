import { useMutation, useQuery } from "@apollo/client";
import { Box, Button, TextField, Rating, Typography } from "@mui/material";
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
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/ConfirmModal";
import Filter from "../../components/Filter";
import CustomSnackbar, { CustomSnackbarProps } from "../../components/Snackbar";
import { parseErrorMessage } from "../../graphql/helper";
import { DELETE_BIKE } from "../../graphql/mutations/bikes";
import { GET_BIKES } from "../../graphql/quries/bikes";
import { useQueryMe } from "../../graphql/quries/me";
import { Bike } from "../../graphql/type";
import { dateIsValid } from "../../utils/common";
import { UserRole } from "../../utils/type";
import BikeModal from "./bikeModal";
import ReserveModal from "./reserveModal";

export type ActionType = "add" | "update" | "reserve" | "cancel";

const date = new Date();
date.setDate(date.getDate() + 7);
const initialEndDate = date;

const BikesPage = () => {
  const navigate = useNavigate();
  const [snackBarDetails, setSnackBar] = useState<CustomSnackbarProps>({});
  const [isOpenReserveModal, setIsOpenReserveModal] = useState(false);
  const [isOpenBikeModal, setIsOpenBikeModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [type, setType] = useState<ActionType>("reserve");
  const [currentBike, setCurrentBike] = useState<Bike>();
  const [start, setStart] = useState<Date | null>(new Date());
  const [end, setEnd] = useState<Date | null>(initialEndDate);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filterModel, setFilterModel] = useState<Record<string, string>>({
    model: "",
    color: "",
    location: "",
    rate: "0",
    start_date: new Date().toISOString().split("T")[0],
    end_date: initialEndDate.toISOString().split("T")[0],
  });

  const { data: me } = useQueryMe();
  const { data, loading, refetch } = useQuery(GET_BIKES, {
    variables: {
      filter: {
        ...filterModel,
        user: me?._id,
        page,
        pageSize,
      },
    },
  });

  const { bikes, total } = useMemo(
    () => ({ bikes: data?.bikes.items, total: data?.bikes.count ?? 0 }),
    [data]
  );

  const [deleteBike] = useMutation(DELETE_BIKE, {
    onCompleted: (res) => {
      if (res.deleteBike._id) {
        setSnackBar({
          open: true,
          message: "Successfully deleted",
          onClose: () => setSnackBar({}),
          severity: "success",
        });
        setConfirmModal(false);
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
          user: me?._id,
          page,
          pageSize,
        },
      });
    }
  }, [filterModel, refetch, me, page, pageSize]);

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

  const handleAdd = useCallback(() => {
    setType("add");
    setIsOpenBikeModal(true);
  }, []);

  const handleEdit = useCallback(
    (params: GridRowParams) => {
      setType("update");
      setIsOpenBikeModal(true);
      setCurrentBike(bikes?.find((b: Bike) => b._id === params.id));
    },
    [bikes]
  );

  const handleRemove = useCallback(
    (params: GridRowParams) => {
      setConfirmModal(true);
      setCurrentBike(bikes?.find((b: Bike) => b._id === params.id));
    },
    [bikes]
  );

  const handleCancelReserve = useCallback(
    (params: GridRowParams) => {
      setType("cancel");
      setIsOpenReserveModal(true);
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

  const onConfirm = useCallback(async () => {
    await deleteBike({
      variables: {
        id: currentBike?._id,
      },
    });
  }, [currentBike?._id, deleteBike]);

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
            name="rating"
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
        getActions: (params: GridRowParams) =>
          me?.role === UserRole.User
            ? [
                <Button
                  variant="outlined"
                  onClick={() => handleCancelReserve(params)}
                >
                  Cancel Reserve
                </Button>,
              ]
            : [
                <Button variant="outlined" onClick={() => handleEdit(params)}>
                  Edit
                </Button>,
                <Button variant="outlined" onClick={() => handleRemove(params)}>
                  Delete
                </Button>,
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/bike/${params.id}/history`)}
                >
                  History
                </Button>,
              ],
      },
    ],
    [handleRemove, handleEdit, me, handleCancelReserve, navigate]
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
          {me?.role === UserRole.Manager && (
            <Button variant="contained" onClick={handleAdd}>
              Add Bike
            </Button>
          )}
        </Box>
        {loading ? (
          <CircularProgress />
        ) : (
          <DataGrid
            rowCount={total}
            rows={
              bikes?.map((bike: Bike) => ({
                ...bike,
                id: bike._id,
              })) || []
            }
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            onPageChange={(res, _) => setPage(res)}
            onPageSizeChange={(res, _) => setPageSize(res)}
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
      <BikeModal
        type={type}
        open={isOpenBikeModal}
        onClose={() => {
          setIsOpenBikeModal(false);
          setCurrentBike(undefined);
        }}
        bike={currentBike}
        startDate={start?.toISOString().split("T")[0]}
        endDate={end?.toISOString().split("T")[0]}
      />
      <ConfirmModal
        title={"Are you sure to delete this bike?"}
        open={confirmModal}
        onClose={() => setConfirmModal(false)}
        onConfirm={onConfirm}
      />
      <CustomSnackbar
        {...snackBarDetails}
        onClose={() => setSnackBar({ open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default BikesPage;
