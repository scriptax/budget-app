import { FaMoneyCheckDollar, FaMoneyBill1 } from "react-icons/fa6";
import { GiPayMoney } from "react-icons/gi";
import { IconType } from "react-icons/lib";

export const budgetCategories = [
  { name: "Housing", code: "Housing" },
  { name: "Transportation", code: "Transportation" },
  { name: "Utilities", code: "Utilities" },
  { name: "Food", code: "Food" },
  { name: "Dining Out", code: "Dining Out" },
  { name: "Entertainment", code: "Entertainment" },
  { name: "Healthcare", code: "Healthcare" },
  { name: "Investments", code: "Investments" },
  { name: "Personal Care", code: "Personal Care" },
  { name: "Education", code: "Education" },
  { name: "Debt", code: "Debt" },
  { name: "Childcare", code: "Childcare" },
  { name: "Pet Care", code: "Pet Care" },
  { name: "Hobbies", code: "Hobbies" },
  { name: "Travel", code: "Travel" },
  { name: "Taxes", code: "Taxes" },
  { name: "Miscellaneous", code: "Miscellaneous" },
];

export const incomeCategories = [
  { name: "Salary", code: "Salary" },
  { name: "Freelance", code: "Freelance" },
  { name: "Side Gig", code: "Side Gig" },
  { name: "Investments", code: "Investments" },
  { name: "Rental Income", code: "Rental Income" },
  { name: "Business", code: "Business" },
  { name: "Gifts", code: "Gifts" },
  { name: "Commission", code: "Commission" },
  { name: "Grants", code: "Grants" },
  { name: "Unemployment", code: "Unemployment" },
  { name: "Rent Assistance", code: "Rent Assistance" },
  { name: "Lottery/Gambling", code: "Lottery/Gambling" },
  { name: "Insurance Payout", code: "Insurance Payout" },
];

type FormContentType = {
  intend: string;
  title: string;
  TitleIcon: IconType;
  nameHint: string;
  categoryName: string;
  confirmText: string;
  inProgressText: string;
};

export const formContent: FormContentType[] = [
  {
    intend: "newBudget",
    title: "Create Budget",
    TitleIcon: FaMoneyCheckDollar,
    nameHint: "e.g. November groceries",
    categoryName: "Budget category",
    confirmText: "Create",
    inProgressText: "Creating...",
  },
  {
    intend: "editBudget",
    title: "Edit Budget",
    TitleIcon: FaMoneyCheckDollar,
    nameHint: "e.g. November groceries",
    categoryName: "Budget category",
    confirmText: "Edit",
    inProgressText: "Editing...",
  },
  {
    intend: "newExpense",
    title: "Add Expense",
    TitleIcon: GiPayMoney,
    nameHint: "e.g. vegetables",
    categoryName: "Budget",
    confirmText: "Add",
    inProgressText: "Adding...",
  },
  {
    intend: "newIncome",
    title: "Add Income",
    TitleIcon: FaMoneyBill1,
    nameHint: "e.g. April salary",
    categoryName: "Income category",
    confirmText: "Add",
    inProgressText: "Adding...",
  },
];

export const months = [
  { name: "January", code: "1" },
  { name: "February", code: "2" },
  { name: "March", code: "3" },
  { name: "April", code: "4" },
  { name: "May", code: "5" },
  { name: "June", code: "6" },
  { name: "July", code: "7" },
  { name: "August", code: "8" },
  { name: "September", code: "9" },
  { name: "October", code: "10" },
  { name: "November", code: "11" },
  { name: "December", code: "12" },
];

export const years = [
  { name: "2023", code: "2023" },
  { name: "2024", code: "2024" },
  { name: "2025", code: "2025" },
  { name: "2026", code: "2026" },
  { name: "2027", code: "2027" },
  { name: "2028", code: "2028" },
  { name: "2029", code: "2029" },
  { name: "2030", code: "2030" },
  { name: "2031", code: "2031" },
  { name: "2032", code: "2032" },
  { name: "2033", code: "2033" },
  { name: "2034", code: "2034" },
];

// export const budgetCategories = [
//   {name: 'Housing', code: 'HOU'},
//   {name: 'Transportation', code: 'TRA'},
//   {name: 'Utilities', code: 'UTI'},
//   {name: 'Food', code: 'FOO'},
//   {name: 'Dining Out', code: 'DINE'},
//   {name: 'Entertainment', code: 'ENT'},
//   {name: 'Healthcare', code: 'HEA'},
//   {name: 'Investments', code: 'INV' },
//   {name: 'Personal Care', code: 'PER'},
//   {name: 'Education', code: 'EDU'},
//   {name: 'Debt', code: 'DEB'},
//   {name: 'Childcare', code: 'CC'},
//   {name: 'Pet Care', code: 'PET'},
//   {name: 'Hobbies', code: 'HOBBY'},
//   {name: 'Travel', code: 'TRAVEL'},
//   {name: 'Taxes', code: 'TAX'},
//   {name: 'Miscellaneous', code: 'MISC'}
// ];

// export const incomeCategories = [
//   { name: 'Salary', code: 'SAL' },
//   { name: 'Freelance', code: 'FRL' },
//   { name: 'Side Gig', code: 'SG' },
//   { name: 'Investments', code: 'INV' },
//   { name: 'Rental Income', code: 'RI' },
//   { name: 'Business', code: 'BUS' },
//   { name: 'Gifts', code: 'GFT' },
//   { name: 'Commission', code: 'COM' },
//   { name: 'Grants', code: 'GRNT' },
//   { name: 'Unemployment', code: 'UE' },
//   { name: 'Rent Assistance', code: 'RA' },
//   { name: 'Lottery/Gambling', code: 'LOT' },
//   { name: 'Insurance Payout', code: 'INS' },
// ];

// const currencies = [
//   { code: "USD", name: "US Dollar" },
//   { code: "EUR", name: "Euro" },
//   { code: "JPY", name: "Japanese Yen" },
//   { code: "GBP", name: "British Pound" },
//   { code: "CNY", name: "Chinese Yuan" },
//   { code: "AUD", name: "Australian Dollar" },
//   { code: "CAD", name: "Canadian Dollar" },
//   { code: "CHF", name: "Swiss Franc" },
//   { code: "HKD", name: "Hong Kong Dollar" },
//   { code: "SGD", name: "Singapore Dollar" },
// ];
