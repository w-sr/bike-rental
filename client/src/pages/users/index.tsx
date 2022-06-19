import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { Box, Button, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useState } from "react";
import ConfirmModal from "../../components/ConfirmModal";
import Filter from "../../components/Filter";
import CustomSnackbar, { CustomSnackbarProps } from "../../components/Snackbar";
import { parseErrorMessage } from "../../graphql/helper";
import { DELETE_USER } from "../../graphql/mutations/users";
import { GET_USERS } from "../../graphql/quries/users";
import { User } from "../../graphql/type";
import UserModal from "./userModal";

const UserPage = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [type, setType] = useState<string>("add");
  const [user, setUser] = useState<User>();
  const [snackBarDetails, setSnackBar] = useState<CustomSnackbarProps>({});
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filterModel, setFilterModel] = useState<Record<string, string>>({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
  });

  const { data, loading, refetch } = useQuery(GET_USERS, {
    variables: {
      filter: {
        ...filterModel,
        page,
        pageSize,
      },
    },
  });

  const { users, total } = useMemo(
    () => ({ users: data?.users.items, total: data?.users.count ?? 0 }),
    [data]
  );

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: (res) => {
      if (res.deleteUser._id) {
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
    refetchQueries: [GET_USERS],
  });

  const handleAdd = useCallback(() => {
    setType("add");
    setUser(undefined);
    setModal(true);
  }, []);

  const handleEdit = useCallback(
    (params: GridRowParams) => {
      setType("edit");
      setModal(true);
      setUser(users?.find((u: User) => u._id === params.id));
    },
    [users]
  );

  const handleDelete = useCallback(
    (params: GridRowParams) => {
      setConfirmModal(true);
      setUser(users?.find((u: User) => u._id === params.id));
    },
    [users]
  );

  const onConfirm = useCallback(async () => {
    await deleteUser({
      variables: {
        id: user?._id,
      },
    });
  }, [deleteUser, user?._id]);

  const filterChange = useCallback(
    (key: string, value: string) => {
      const newFilter = { ...filterModel };
      newFilter[key] = value;
      setFilterModel(newFilter);
    },
    [filterModel]
  );

  useEffect(() => {
    if (refetch) {
      const newFilter = { ...filterModel };
      newFilter.role = newFilter.role === "all" ? "" : newFilter.role;
      refetch({
        filter: {
          ...newFilter,
          page,
          pageSize,
        },
      });
    }
  }, [filterModel, refetch, page, pageSize]);

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "first_name",
        headerName: "First Name",
        sortable: true,
        flex: 1,
      },
      {
        field: "last_name",
        headerName: "Last Name",
        sortable: true,
        flex: 1,
      },
      {
        field: "email",
        headerName: "Email",
        sortable: true,
        flex: 1,
      },
      {
        field: "role",
        headerName: "Role",
        sortable: true,
        flex: 1,
      },
      {
        field: "actions",
        type: "actions",
        sortable: false,
        flex: 1,
        getActions: (params: GridRowParams) => [
          <Button variant="outlined" onClick={() => handleEdit(params)}>
            Edit
          </Button>,
          <Button variant="outlined" onClick={() => handleDelete(params)}>
            Delete
          </Button>,
          <Button
            variant="outlined"
            onClick={() => navigate(`/user/${params.id}/history`)}
          >
            History
          </Button>,
        ],
      },
    ],
    [handleDelete, handleEdit, navigate]
  );

  return (
    <Box flexGrow={1} mx={5} mt={5}>
      <Box display="flex" my={2}>
        <Filter filterChange={filterChange} model={filterModel} />
      </Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5">Users</Typography>
        <Button variant="contained" onClick={handleAdd}>
          Add User
        </Button>
      </Box>
      <Box sx={{ height: 600, flexGrow: 1 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <DataGrid
            rowCount={total}
            rows={users?.map((user: User) => ({ ...user, id: user._id })) || []}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            onPageChange={(res, _) => setPage(res)}
            onPageSizeChange={(res, _) => setPageSize(res)}
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
      <ConfirmModal
        open={confirmModal}
        onClose={() => setConfirmModal(false)}
        title={"Are you sure to delete this user?"}
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

export default UserPage;
