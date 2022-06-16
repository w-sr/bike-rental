import { useQuery } from "@apollo/client";
import { InputLabel } from "@mui/material";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { GET_RESERVATIONS } from "../utils/quries/reservations";
import { Bike, Reservation, User } from "../utils/type";

const Dashboard = () => {
  const [filterModel, setFilterModel] = useState<Record<string, string>>({
    user: "",
    bike: "",
  });

  const { data, refetch } = useQuery(GET_RESERVATIONS);

  const reservations = data?.reservations as Reservation[];

  const rows = data?.reservations.map((d: Reservation) => {
    const { user, bike, ...r } = d;
    const { id: bike_id, ...b } = bike;
    const { id: user_id, ...u } = user;
    return { ...b, ...u, ...r };
  });

  const users = reservations?.reduce<User[]>(
    (res: User[], current: Reservation) => {
      const x = res.find((item: User) => item.id === current.user.id);
      if (!x) res.push(current.user);
      return res;
    },
    []
  );

  const bikes = reservations?.reduce<Bike[]>(
    (res: Bike[], current: Reservation) => {
      const x = res.find((item: Bike) => item.id === current.bike.id);
      if (!x) res.push(current.bike);
      return res;
    },
    []
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "first_name",
        headerName: "First Name",
        width: 150,
      },
      {
        field: "last_name",
        headerName: "Last Name",
        width: 150,
      },
      {
        field: "email",
        headerName: "Email",
        width: 160,
      },
      {
        field: "role",
        headerName: "Role",
        width: 120,
      },
      {
        field: "model",
        headerName: "Model",
        editable: false,
      },
      {
        field: "location",
        headerName: "Location",
        width: 150,
      },
      {
        field: "color",
        headerName: "Color",
        sortable: false,
        width: 160,
      },
      {
        field: "start_date",
        headerName: "Start Date",
        width: 160,
      },
      {
        field: "end_date",
        headerName: "End Date",
        width: 160,
      },
    ],
    []
  );

  useEffect(() => {
    if (refetch) {
      refetch({
        filter: {
          ...filterModel,
        },
      });
    }
  }, [filterModel, refetch]);

  const handleChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    const newFilter = { ...filterModel };
    newFilter[name] = value;
    setFilterModel(newFilter);
  };

  return (
    <Box sx={{ flexGrow: 1, mx: 5 }}>
      <Box sx={{ flexGrow: 1 }} display={"flex"} justifyContent="flex-end">
        <Box display="flex" alignItems="center">
          <InputLabel sx={{ mr: 1 }}>Filter by Bike</InputLabel>
          <Select
            labelId="filter-by-bike"
            id="filter-by-bike"
            size="small"
            name="bike"
            onChange={handleChange}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {bikes?.map((bike: Bike) => (
              <MenuItem key={bike.id} value={bike.id}>
                {bike.model}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box display="flex" alignItems="center" mx={2}>
          <InputLabel sx={{ mr: 1 }}>Filter by User</InputLabel>
          <Select
            labelId="filter-by-user"
            id="filter-by-user"
            name="user"
            onChange={handleChange}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {users?.map((user: User) => (
              <MenuItem key={user.id} value={user.id}>
                {user.first_name + " " + user.last_name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
      <Box m={2} sx={{ height: 400, flexGrow: 1 }}>
        <DataGrid
          rows={rows || []}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
