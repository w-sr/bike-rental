export const validateEmail = (email: string) => {
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

export const validateName = (name: string) => {
  var regex = /[a-zA-Z]/;
  return regex.test(name);
};

export const validateDate = (date: string) => {
  var regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(date);
};
