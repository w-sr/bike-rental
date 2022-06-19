import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ReservationHistory from "../../components/Reservation";
import { GET_RESERVATIONS } from "../../graphql/quries/reservations";
import { Reservation } from "../../graphql/type";

const UserHistory = () => {
  let { userId } = useParams();
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const { data, refetch } = useQuery(GET_RESERVATIONS, {
    variables: {
      filter: {
        user: userId,
        page,
        pageSize,
      },
    },
  });

  const rows = useMemo(
    () =>
      data?.reservations.items.map((d: Reservation) => {
        const { user, bike, ...r } = d;
        const { _id: bike_id, ...b } = bike;
        const { _id: user_id, ...u } = user;
        return { ...b, ...u, ...r, id: r._id };
      }),
    [data]
  );
  const total = useMemo(() => data?.reservations.count, [data]);

  useEffect(() => {
    if (refetch) {
      refetch({
        filter: {
          user: userId,
          page,
          pageSize,
        },
      });
    }
  }, [refetch, userId, page, pageSize]);

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "model",
        headerName: "Model",
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
        field: "color",
        headerName: "Color",
        sortable: false,
        flex: 1,
      },
      {
        field: "start_date",
        headerName: "Start Date",
        sortable: true,
        flex: 1,
      },
      {
        field: "end_date",
        headerName: "End Date",
        sortable: true,
        flex: 1,
      },
    ],
    []
  );

  return (
    <Box flexGrow={1} mx={5} mt={5}>
      <ReservationHistory
        total={total}
        columns={columns}
        rows={rows}
        name="user"
        handlePageChange={(res, _) => setPage(res)}
        handlePageSizeChange={(res, _) => setPageSize(res)}
      />
    </Box>
  );
};

export default UserHistory;
