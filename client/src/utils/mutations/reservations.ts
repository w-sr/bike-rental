import { gql } from "@apollo/client";

export const CREATE_RESERVATION = gql`
  mutation CreateReservation($input: ReservationCreateInput!) {
    createReservation(input: $input) {
      id
      start_date
      end_date
    }
  }
`;
