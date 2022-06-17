import { gql } from "@apollo/client";

export const UPDATE_USER = gql`
  mutation UpdateUser($id: String!, $input: UserUpdateInput!) {
    updateUser(input: $input, id: $id) {
      _id
      first_name
      last_name
      email
      role
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: UserCreateInput!) {
    createUser(input: $input) {
      _id
      first_name
      last_name
      email
      role
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id) {
      _id
    }
  }
`;
