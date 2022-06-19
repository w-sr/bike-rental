import { gql, useQuery } from "@apollo/client";
import { Bike, QueryHookResult } from "../type";

export const GET_BIKES = gql`
  query getBikes($filter: BikeInputFilter) {
    bikes(filters: $filter) {
      _id
      model
      color
      location
      rate
    }
  }
`;

export const GET_BIKE = gql`
  query getBike {
    bike {
      _id
      model
      color
      location
      rate
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
