import { Box, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { useQueryMe } from "../../utils/quries/me";
import { useQueryUsers } from "../../utils/quries/users";
import { User } from "../../utils/type";
import { useMutation } from "@apollo/client";
import { DELETE_USER } from "../../utils/mutations/users";
import UserModal from "./userModal";

const Users = () => {
  const [modal, setModal] = useState(false);
  const [type, setType] = useState<string>("add");
  const [user, setUser] = useState<User>();

  const { data: me, loading: userLoading } = useQueryMe();
  const { data: users, loading: usersLoading } = useQueryUsers(me);
  const loading = userLoading || usersLoading;

  const [deleteUser] = useMutation(DELETE_USER);

  const handleAdd = () => {
    setType("add");
    setUser(undefined);
    setModal(true);
  };

  const handleEdit = (params: any) => {
    setType("edit");
    setModal(true);
    setUser(users?.find((u) => u.id === params.id));
  };

  const handleDelete = async (params: any) => {
    const result = await deleteUser({
      variables: {
        id: params.id,
      },
    });
  };

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "first_name",
        headerName: "First Name",
        width: 150,
        editable: true,
      },
      {
        field: "last_name",
        headerName: "Last Name",
        width: 150,
        editable: true,
      },
      {
        field: "email",
        headerName: "Email",
        sortable: false,
        width: 160,
      },
      {
        field: "role",
        headerName: "Role",
        sortable: false,
        width: 120,
      },
      {
        field: "actions",
        type: "actions",
        sortable: false,
        width: 80,
        getActions: (params: any) => [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEdit(params)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDelete(params)}
          />,
        ],
      },
    ],
    [handleDelete, handleEdit]
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, mx: 10 }}>
      <Box m={2} display="flex" justifyContent="flex-end">
        <Button variant="contained" onClick={handleAdd}>
          Add User
        </Button>
      </Box>
      <Box m={2} sx={{ height: 400, flexGrow: 1 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <DataGrid
            rows={users || []}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
          />
        )}
      </Box>
      <UserModal
        open={modal}
        onClose={() => setModal(false)}
        type={type}
        user={user}
      />
    </Box>
  );
};

export default Users;
