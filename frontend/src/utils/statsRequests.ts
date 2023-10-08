import axios from "axios";

const apiDomain =
  process.env.REACT_APP_ENV === "development"
    ? "http://127.0.0.1:5000"
    : process.env.REACT_APP_API_PROD_DOMAIN;

async function getStats(url: string) {
  const querysString = new URL(url).search;
  const params = new URLSearchParams(querysString);
  const querysData = Object.fromEntries(params);
  const data = await axios.get(
    `${apiDomain}/api/v1/stats/${querysData.reptype}?year=${querysData.year}&month=${querysData.month}&category=${querysData.category}`,
    {
      withCredentials: true,
    },
  );
  return data;
}

export { getStats };
