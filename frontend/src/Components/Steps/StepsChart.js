import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { Button, Typography } from "@mui/material";

import "../../App.css";

const weekday = require("dayjs/plugin/weekday");
dayjs.extend(weekday);

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title);

// props: steps
const StepsChart = (props) => {
  const [type, setType] = useState("Daily");
  const [labels, setLabels] = useState([]);
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    // adjust range to change number of points retrieved
    filterSteps(type);
  }, [props.steps, type]);

  // reduce creates an object and uses the obj[key] capability to group data by day, week, and month
  const filterSteps = (filter) => {
    let dates = [];
    let amounts = [];

    if (filter === "Daily") {
      const range = 7;
      const grouped = props.steps.reduce((prev, curr) => {
        const day = dayjs(curr.date).hour(0).format("YYYY-MM-DD");
        // if : object property exists
        if (prev[day]) prev[day] += curr.amount;
        // else : create object property
        else prev[day] = curr.amount;

        return prev;
      }, {});

      // fill in missing days
      let endDate = dayjs().add(1, "day");
      let startDate = endDate.subtract(range, "day");
      for (let i = startDate; i.isBefore(endDate, "day"); i = i.add(1, "day")) {
        const formatted = i.format("YYYY-MM-DD");
        dates.push(formatted);
        if (grouped[formatted]) {
          amounts.push(grouped[formatted]);
        } else amounts.push(0);
      }
    } else if (type === "Weekly") {
      const range = 8;
      // total steps by week
      const grouped = props.steps.reduce((prev, curr) => {
        const week = dayjs(curr.date).weekday(0).format("YYYY-MM-DD");
        if (prev[week]) prev[week] += curr.amount;
        else prev[week] = curr.amount;

        return prev;
      }, {});

      // fill in missing data
      let endDate = dayjs().add(1, "week");
      let startDate = endDate.subtract(range, "week");
      for (let i = startDate; i.isBefore(endDate, ""); i = i.add(1, "week")) {
        const formatted = i.weekday(0).format("YYYY-MM-DD");
        dates.push(formatted);
        if (grouped[formatted]) {
          amounts.push(grouped[formatted]);
        } else amounts.push(0);
      }
    } else if (type === "Monthly") {
      const range = 12;
      // group steps by month
      const grouped = props.steps.reduce((prev, curr) => {
        const month = dayjs(curr.date).format("MMM-YY");
        if (prev[month]) prev[month] += curr.amount;
        else prev[month] = curr.amount;

        return prev;
      }, {});

      // fill in missing data
      let endDate = dayjs().add(1, "month");
      let startDate = endDate.subtract(range, "month");
      for (let i = startDate; i.isBefore(endDate, ""); i = i.add(1, "month")) {
        const formatted = i.format("MMM-YY");
        dates.push(formatted);
        if (grouped[formatted]) {
          amounts.push(grouped[formatted]);
        } else amounts.push(0);
      }
    }

    setLabels(dates);
    setDataset(amounts);
  };

  return (
    <>
      <Line
        datasetIdKey="data"
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: `${type} Steps Chart`,
            },
          },
        }}
        data={{
          labels: labels,
          datasets: [
            {
              data: dataset,
              borderColor: "rgb(255, 133, 20)",
              backgroundColor: "rgba(255, 133, 20, 0.5)",
            },
          ],
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "15px",
        }}
      >
        <Button
          color={type === "Daily" ? "secondary" : "primary"}
          onClick={() => setType("Daily")}
          style={{ textTransform: "none", width: "30%" }}
          variant="contained"
        >
          <Typography color="black" variant="subtitle1">
            daily
          </Typography>
        </Button>
        <Button
          color={type === "Weekly" ? "secondary" : "primary"}
          onClick={() => setType("Weekly")}
          style={{ textTransform: "none", width: "30%" }}
          variant="contained"
        >
          <Typography color="black" variant="subtitle1">
            weekly
          </Typography>
        </Button>
        <Button
          color={type === "Monthly" ? "secondary" : "primary"}
          onClick={() => setType("Monthly")}
          style={{ textTransform: "none", width: "30%" }}
          variant="contained"
        >
          <Typography color="black" variant="subtitle1">
            monthly
          </Typography>
        </Button>
      </div>
    </>
  );
};

export default StepsChart;
