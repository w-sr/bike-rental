import { gql, useQuery } from "@apollo/client";
import { QueryHookResult, User } from "../type";

export const GET_USERS = gql`
  query getUsers {
    users {
      id
      first_name
      last_name
      email
      role
    }
  }
`;

export const useQueryUsers = (
  user: User | undefined
): QueryHookResult<User[]> => {
  const skip = user?.role !== "manager";
  const { data, loading } = useQuery(GET_USERS, { skip });
  return { data: data?.users, loading };
};
