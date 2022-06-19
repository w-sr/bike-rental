import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

type ReservationProps = {
  name: string;
  columns: GridColDef[];
  rows: any[];
  total: number;
  handlePageChange: (page: number, details: any) => void;
  handlePageSizeChange: (page: number, details: any) => void;
};

const Reservation = ({
  columns,
  rows,
  total,
  name,
  handlePageChange,
  handlePageSizeChange,
}: ReservationProps) => {
  const navigate = useNavigate();

  return (
    <Box flexGrow={1} mx={5} mt={5}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton
          size="large"
          aria-label="log out"
          color="inherit"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">Reservations for {name}</Typography>
      </Box>

      <Box sx={{ height: 650, flexGrow: 1 }}>
        <DataGrid
          rowCount={total}
          rows={rows || []}
          columns={columns}
          pageSize={10}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default Reservation;
