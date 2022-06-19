export type QueryHookResult<T> = {
  data?: T;
  loading: boolean;
  refetch?: () => void;
};

export type User = {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
};

export type Bike = {
  _id: string;
  model: string;
  color: string;
  location: string;
  rate: string;
};

export type Reservation = {
  _id: string;
  user: User;
  bike: Bike;
  start_date: string;
  end_date: string;
  status: string;
};
