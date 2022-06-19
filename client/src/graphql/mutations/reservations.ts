import { gql } from "@apollo/client";

export const CREATE_RESERVATION = gql`
  mutation CreateReservation($input: ReservationCreateInput!) {
    createReservation(input: $input) {
      _id
      start_date
      end_date
    }
  }
`;

export const CANCEL_RESERVATION = gql`
  mutation CancelReservation($input: ReservationCancelInput!) {
    cancelReservation(input: $input) {
      _id
    }
  }
`;
