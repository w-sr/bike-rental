import { gql } from "@apollo/client";

export const UPDATE_BIKE = gql`
  mutation UpdateBike($id: String!, $input: BikeUpdateInput!) {
    updateBike(input: $input, id: $id) {
      id
      model
      color
      location
      rating
      rented
    }
  }
`;

export const CREATE_BIKE = gql`
  mutation CreateBike($input: BikeCreateInput!) {
    createBike(input: $input) {
      id
      model
      color
      location
      rating
      rented
    }
  }
`;

export const DELETE_BIKE = gql`
  mutation DeleteBike($id: ID!) {
    deleteBike(id: $id) {
      id
    }
  }
`;
