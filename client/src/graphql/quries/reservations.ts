import { gql, useQuery } from "@apollo/client";
import { Reservation, QueryHookResult } from "../type";

export const GET_RESERVATIONS = gql`
  query getReservations($filter: ReservationsInput!) {
    reservations(filters: $filter) {
      items {
        _id
        user {
          _id
          first_name
          last_name
          email
          role
        }
        bike {
          _id
          model
          color
          location
          rate
        }
        start_date
        end_date
      }
      count
    }
  }
`;

export const useQueryReservations = (): QueryHookResult<Reservation[]> => {
  const { data, loading } = useQuery(GET_RESERVATIONS);
  return { data: data?.reservations, loading };
};
