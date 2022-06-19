import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      user {
        _id
        first_name
        last_name
        email
        role
      }
      token
    }
  }
`;

export const REGISTER = gql`
  mutation register($data: RegisterInput!) {
    register(data: $data) {
      user {
        _id
        first_name
        last_name
        email
        role
      }
      token
    }
  }
`;
