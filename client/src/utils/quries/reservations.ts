import { gql, useQuery } from "@apollo/client";
import { Reservation, QueryHookResult } from "../type";

export const GET_RESERVATIONS = gql`
  query getReservations {
    reservations {
      id
      user {
        id
        first_name
        last_name
        email
        role
      }
      bike {
        id
        model
        color
        location
        rating
        rented
      }
      start_date
      end_date
    }
  }
`;

export const GET_RESERVATION = gql`
  query getReservation {
    reservation {
      id
      user {
        id
        first_name
        last_name
        email
        role
      }
      bike {
        id
        model
        color
        location
        rating
        rented
      }
      start_date
      end_date
    }
  }
`;

export const useQueryReservation = (
  id: string | undefined
): QueryHookResult<Reservation> => {
  const skip = !id;
  const variables = { id };
  const { data, loading } = useQuery(GET_RESERVATION, { variables, skip });
  return { data, loading };
};

export const useQueryReservations = (): QueryHookResult<Reservation[]> => {
  const { data, loading } = useQuery(GET_RESERVATIONS);
  return { data: data?.reservations, loading };
};
