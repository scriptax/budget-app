import axios from "axios";

const apiDomain =
  process.env.REACT_APP_ENV === "development"
    ? "http://127.0.0.1:5000"
    : process.env.REACT_APP_API_PROD_DOMAIN;

async function test() {
  const res = await axios({
    method: "POST",
    url: `${apiDomain}/test/testing`,
    withCredentials: true,
    data: {},
  });
  return res;
}

async function getDashboard() {
  const dashboard = await axios.get(`${apiDomain}/api/v1/users/dashboard`, {
    withCredentials: true,
  });
  return dashboard;
}

type LoginDataType = {
  email: string;
  password: string;
};
async function login({ email, password }: LoginDataType) {
  console.log("LOGGING IN");
  const res = await axios({
    method: "POST",
    url: `${apiDomain}/api/v1/users/login`,
    withCredentials: true,
    data: {
      email,
      password,
    },
  });
  return res;
}

async function logout() {
  const response = axios.get(`${apiDomain}/api/v1/users/logout`, {
    withCredentials: true,
  });
  return response;
}

type SignupDataType = {
  name: string;
  email: string;
  password: string;
  currentBalance: string;
  preferredCurrency: string;
};
async function signup({
  name,
  email,
  password,
  currentBalance,
  preferredCurrency,
}: SignupDataType) {
  const res = await axios({
    method: "POST",
    url: `${apiDomain}/api/v1/users/signup`,
    withCredentials: true,
    data: {
      name,
      email,
      password,
      passwordConfirm: password,
      currentBalance: Number(currentBalance),
      preferredCurrency,
    },
  });
  return res;
}

type UpdateDataType = {
  name: string;
  email: string;
  currentBalance: number;
};
async function updateData({ name, email, currentBalance }: UpdateDataType) {
  const res = await axios({
    method: "PATCH",
    url: `${apiDomain}/api/v1/users/updateAccount`,
    withCredentials: true,
    data: {
      name,
      email,
      currentBalance,
    },
  });
  return res;
}

type UpdatePasswordType = {
  password: string;
  newPassword: string;
  confirmPassword: number;
};
async function updatePassword({
  password,
  newPassword,
  confirmPassword,
}: UpdatePasswordType) {
  const res = await axios({
    method: "PATCH",
    url: `${apiDomain}/api/v1/users/updatePassword`,
    withCredentials: true,
    data: {
      currentPassword: password,
      newPassword: newPassword,
      newPasswordConfirm: confirmPassword,
    },
  });
  return res;
}

async function deleteAccount() {
  const res = await axios({
    method: "DELETE",
    url: `${apiDomain}/api/v1/users/deleteAccount`,
    withCredentials: true,
    data: {},
  });
  return res;
}

export {
  test,
  getDashboard,
  login,
  logout,
  signup,
  updateData,
  updatePassword,
  deleteAccount,
};
