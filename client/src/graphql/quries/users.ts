import { gql, useQuery } from "@apollo/client";
import { UserRole } from "../../utils/type";
import { QueryHookResult, User } from "../type";

export const GET_USERS = gql`
  query getUsers($filter: UserFilterInput) {
    users(filters: $filter) {
      items {
        _id
        first_name
        last_name
        email
        role
      }
      count
    }
  }
`;

export const useQueryUsers = (
  user: User | undefined
): QueryHookResult<User[]> => {
  const skip = user?.role !== UserRole.Manager;
  const { data, loading } = useQuery(GET_USERS, { skip });
  return { data: data?.users, loading };
};
