import { gql, useQuery } from "@apollo/client";
import { Bike, QueryHookResult } from "../type";

export const GET_BIKES = gql`
  query getBikes($filter: BikeInputFilter) {
    bikes(input: $filter) {
      id
      model
      color
      location
      rating
      rented
    }
  }
`;

export const GET_BIKE = gql`
  query getBike {
    bike {
      id
      model
      color
      location
      rating
      rented
    }
  }
`;

export const useQueryBike = (id: string | undefined): QueryHookResult<Bike> => {
  const skip = !id;
  const variables = { id };
  const { data, loading } = useQuery(GET_BIKE, { variables, skip });
  return { data, loading };
};

export const useQueryBikes = (): QueryHookResult<Bike[]> => {
  const { data, loading, refetch } = useQuery(GET_BIKES);
  return { data: data?.bikes, loading, refetch };
};
