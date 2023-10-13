import { ReactElement } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
);

type PieChartType = {
  data: number[];
  labels: string[];
  label: string;
  title: string;
};
function PieChart({ data, labels, label, title }: PieChartType): ReactElement {
  const chartData: ChartData<"pie"> = {
    labels: labels,
    datasets: [
      {
        label: label,
        data: data,
        backgroundColor: [
          "rgb(30, 41, 59)",
          "rgb(4, 120, 87)",
          "rgb(252, 140, 3)",
          "rgb(3, 98, 252)",
          "rgb(252, 3, 3)",
        ],
      },
    ],
  };

  const chartOptions: ChartOptions<"pie"> = {
    maintainAspectRatio: false,
    // animation: false,
    plugins: {
      title: {
        text: title,
        align: "center",
        display: true,
        position: "top",
        font: { size: 16, family: "Poppins", weight: "200" },
        color: "black",
      },
      legend: {
        position: "bottom",
        labels: {
          color: "black",
          font: { family: "Poppins" },
        },
      },
    },
  };

  return <Pie data={chartData} options={chartOptions} />;
}

type BarChartType = {
  data: number[];
  labels: string[];
  label: string;
  title: string;
};
function BarChart({ data, labels, label, title }: BarChartType): ReactElement {
  const chartData: ChartData<"bar"> = {
    labels: labels,
    datasets: [
      {
        label: label,
        data: data,
        backgroundColor: "rgb(30, 41, 59)",
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    maintainAspectRatio: false,
    // animation: false,
    plugins: {
      title: {
        text: title,
        align: "center",
        display: true,
        position: "top",
        font: { size: 16, family: "Poppins", weight: "200" },
        color: "black",
      },
      legend: {
        position: "bottom",
        labels: {
          color: "black",
          font: { family: "Poppins" },
        },
      },
    },
  };

  return <Bar data={chartData} options={chartOptions} />;
}

export { PieChart, BarChart };
