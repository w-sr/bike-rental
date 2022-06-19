export const dateIsValid = (date: any) => {
  const today = new Date().toISOString().split("T")[0];
  const end = new Date(2099, 1, 1).toISOString().split("T")[0];
  if (
    typeof date === "object" &&
    date !== null &&
    typeof date.getTime === "function" &&
    !isNaN(date) &&
    date.toISOString().split("T")[0] >= today &&
    date.toISOString().split("T")[0] <= end
  ) {
    return true;
  }

  return false;
};
