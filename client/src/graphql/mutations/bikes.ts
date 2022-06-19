import { gql } from "@apollo/client";

export const UPDATE_BIKE = gql`
  mutation UpdateBike($id: String!, $input: BikeUpdateInput!) {
    updateBike(input: $input, _id: $id) {
      _id
      model
      color
      location
      rate
    }
  }
`;

export const CREATE_BIKE = gql`
  mutation CreateBike($input: BikeCreateInput!) {
    createBike(input: $input) {
      _id
      model
      color
      location
      rate
    }
  }
`;

export const DELETE_BIKE = gql`
  mutation DeleteBike($id: String!) {
    deleteBike(_id: $id) {
      _id
    }
  }
`;
