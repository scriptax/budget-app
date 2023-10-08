import axios from "axios";

const apiDomain =
  process.env.REACT_APP_ENV === "development"
    ? "http://127.0.0.1:5000"
    : process.env.REACT_APP_API_PROD_DOMAIN;

type AddBudgetData = {
  name: string;
  amount: string;
  category: { name: string; code: string };
};
async function addBudget({ name, amount, category }: AddBudgetData) {
  const res = await axios({
    method: "POST",
    url: `${apiDomain}/api/v1/budget`,
    withCredentials: true,
    data: {
      name,
      amount: Number(amount),
      category: category.name,
    },
  });
  return res;
}

type EditBudgetData = {
  name: string;
  amount: string;
  category: { name: string; code: string };
  id: string;
};
async function editBudget({ name, amount, category, id }: EditBudgetData) {
  const res = await axios({
    method: "PATCH",
    url: `${apiDomain}/api/v1/budget/${id}`,
    withCredentials: true,
    data: {
      name,
      amount: Number(amount),
      category: category.name,
    },
  });
  return res;
}

type CloseBudgetData = {
  close: boolean;
  id: string;
};
async function closeBudget({ close, id }: CloseBudgetData) {
  const res = await axios({
    method: "PATCH",
    url: `${apiDomain}/api/v1/budget/${id}`,
    withCredentials: true,
    data: {
      close,
    },
  });
  return res;
}

async function getBudget(id: string) {
  const data = await axios.get(`${apiDomain}/api/v1/budget/${id}`, {
    withCredentials: true,
  });
  return data;
}

async function deleteBudget(id: string) {
  const res = await axios({
    method: "DELETE",
    url: `${apiDomain}/api/v1/budget/${id}`,
    withCredentials: true,
    data: {},
  });
  return res;
}

async function getExpenses() {
  const res = await axios.get(`${apiDomain}/api/v1/expense`, {
    withCredentials: true,
  });
  return res;
}

type AddExpenseData = {
  name: string;
  amount: string;
  category: { name: string; code: string };
};
async function addExpense({ name, amount, category }: AddExpenseData) {
  const res = await axios({
    method: "POST",
    url: `${apiDomain}/api/v1/expense`,
    withCredentials: true,
    data: {
      name,
      amount: Number(amount),
      budget: category.code,
    },
  });
  return res;
}

async function deleteExpense(id: string) {
  const res = await axios({
    method: "DELETE",
    url: `${apiDomain}/api/v1/expense/${id}`,
    withCredentials: true,
    data: {},
  });
  return res;
}

async function getIncomes() {
  const res = await axios.get(`${apiDomain}/api/v1/income`, {
    withCredentials: true,
  });
  return res;
}

type AddIncomeData = {
  name: string;
  amount: string;
  category: { name: string; code: string };
};
async function addIncome({ name, amount, category }: AddIncomeData) {
  const res = await axios({
    method: "POST",
    url: `${apiDomain}/api/v1/income`,
    withCredentials: true,
    data: {
      name,
      amount: Number(amount),
      category: category.name,
    },
  });
  return res;
}

async function deleteIncome(id: string) {
  const res = await axios({
    method: "DELETE",
    url: `${apiDomain}/api/v1/income/${id}`,
    withCredentials: true,
    data: {},
  });
  return res;
}

export {
  addBudget,
  editBudget,
  addExpense,
  addIncome,
  getBudget,
  deleteBudget,
  closeBudget,
  deleteExpense,
  getExpenses,
  deleteIncome,
  getIncomes,
};
