import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Card, CardContent, IconButton, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import theme from "../theme";
import "../App.css";
import CaloriesInputModal from "./CaloriesInputModal";
import dayjs from "dayjs";

const CaloriesComponent = () => {
  const [userCalories, setUserCalories] = useState([]);
  const [inputModelOpen, setInputModelOpen] = useState(false);
  const [todayTotal, setTodayTotal] = useState(0);
  const [weekTotal, setWeekTotal] = useState(0);
  const [monthTotal, setMonthTotal] = useState(0);

  //On this page load, get the calories for the user
  useEffect(() => {
    getCaloriesForUser();
  }, []);

  //Get calories for userid query
  const getCaloriesForUser = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let query = JSON.stringify({
        query: `query{getCaloriesForUser(user_id: "${window.sessionStorage.getItem(
          "user_id"
        )}"){user_id, amount, date}}`,
      });

      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });

      //Send the query
      let json = await response.json();

      //Set all users data to the result
      setUserCalories(json.data.getCaloriesForUser);

      calcTotals(json.data.getCaloriesForUser);
    } catch (error) {
      console.log(`Problem getting calories for user - ${error.message}`);
    }
  };

  const calcTotals = async (userCalories) => {
    // console.log(dayjs(userCalories[0].date).toString());

    console.log(userCalories);
    // let today = dayjs();
    // let date = dayjs(userCalories[0].date).toString();

    let todayTotal = 0;
    let weekTotal = 0;
    let monthTotal = 0;

    userCalories.forEach((entry) => {
      let date = entry.date;
      if (dayjs(date).isSame(dayjs(), "date")) {
        todayTotal += entry.amount;
      }
      if (dayjs(date).isSame(dayjs(), "week")) {
        weekTotal += entry.amount;
      }
      if (dayjs(date).isSame(dayjs(), "month")) {
        monthTotal += entry.amount;
      }
    });

    setTodayTotal(todayTotal);
    setWeekTotal(weekTotal);
    setMonthTotal(monthTotal);
  };

  return (
    <ThemeProvider theme={theme}>
      <Card>
        <CardContent>
          <Typography
            variant="h5"
            color="primary"
            style={{ textAlign: "center" }}
          >
            Your Calories
          </Typography>

          <Typography variant="h6" color="secondary">
            Today
          </Typography>
          <Typography variant="body1" color="text">
            {todayTotal}
          </Typography>

          <Typography variant="h6" color="secondary">
            This Week
          </Typography>
          <Typography variant="body1" color="text">
            {weekTotal}
          </Typography>

          <Typography variant="h6" color="secondary">
            This Month
          </Typography>
          <Typography variant="body1" color="text">
            {monthTotal}
          </Typography>
          <div className="rightAlign">
            <IconButton onClick={() => setInputModelOpen(true)}>
              <AddCircleOutlineIcon style={{ color: "black", fontSize: 60 }} />
            </IconButton>
          </div>
        </CardContent>
      </Card>
      <CaloriesInputModal
        open={inputModelOpen}
        onCancel={() => setInputModelOpen(false)}
        reloadUserCalories={() => getCaloriesForUser()}
      />
    </ThemeProvider>
  );
};
export default CaloriesComponent;
