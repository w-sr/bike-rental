import { useMutation } from "@apollo/client";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { DELETE_BIKE } from "../../utils/mutations/bikes";
import { useQueryBikes } from "../../utils/quries/bikes";
import { Bike } from "../../utils/type";
import BikeModal from "./bikeModal";

const Bikes = () => {
  const [modal, setModal] = useState(false);
  const [type, setType] = useState<string>("add");
  const [bike, setBike] = useState<Bike>();

  const { data: bikes, loading } = useQueryBikes();

  const [deleteBike] = useMutation(DELETE_BIKE);

  const handleAdd = () => {
    setType("add");
    setBike(undefined);
    setModal(true);
  };

  const handleEdit = (params: any) => {
    setType("edit");
    setModal(true);
    setBike(bikes?.find((b) => b.id === params.id));
  };

  const handleDelete = async (params: any) => {
    const result = await deleteBike({
      variables: {
        id: params.id,
      },
    });
  };

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "model",
        headerName: "Model",
        width: 150,
        editable: true,
      },
      {
        field: "color",
        headerName: "Color",
        width: 150,
        editable: true,
      },
      {
        field: "location",
        headerName: "location",
        sortable: false,
        width: 160,
      },
      {
        field: "rating",
        headerName: "rating",
        sortable: false,
        width: 120,
      },
      {
        field: "rented",
        headerName: "Rented",
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
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Box m={2} display="flex" justifyContent="flex-end">
        <Button variant="contained" onClick={handleAdd}>
          Add Bike
        </Button>
      </Box>
      <Box m={2} sx={{ height: 400, flexGrow: 1 }}>
        <DataGrid
          rows={bikes || []}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
        />
      </Box>
      <BikeModal
        open={modal}
        onClose={() => setModal(false)}
        type={type}
        bike={bike}
      />
    </Box>
  );
};

export default Bikes;
