import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Box, Button, Container, Typography } from "@mui/material";
import dayjs from "dayjs";
import theme from "../../theme";
import "../../App.css";

var weekOfYear = require("dayjs/plugin/weekOfYear");
dayjs.extend(weekOfYear);

const SummaryComponent = () => {
  const GRAPHQLURL = "http://localhost:5000/graphql";
  const [userCaloriesList, setUserCaloriesList] = useState([]);
  const [userStepsList, setUserStepsList] = useState([]);
  const [userCaloriesTotal, setUserCaloriesTotal] = useState([]);
  const [userStepsTotal, setUserStepsTotal] = useState([]);
  const [userCaloriesPrevTotal, setUserCaloriesPrevTotal] = useState([]);
  const [userStepsThisPrevTotal, setUserStepsPrevTotal] = useState([]);
  const [showAllTime, setShowAllTime] = useState(true);
  const [showMonthly, setShowMonthly] = useState(false);
  const [showWeekly, setShowWeekly] = useState(false);
  const USER_ID = window.sessionStorage.getItem("user_id");
  var NOW = dayjs();

  //On this page load, get the calories for the user
  useEffect(() => {
    getUserInfo();
  }, []);

  const fetchinfo = async (queryString, fetchURL) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let query = JSON.stringify({
        query: queryString,
      });

      let response = await fetch(fetchURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });
      let json = await response.json();
      return json.data;
    } catch (error) {
      console.log(`Problem getting calories for user - ${error.message}`);
    }
  };

  const getUserInfo = async () => {
    let caloriesQuery = `query{getCaloriesForUser(user_id: "${USER_ID}" ){user_id, amount, date}}`;
    let caloriesList = await fetchinfo(caloriesQuery, GRAPHQLURL);
    setUserCaloriesList(caloriesList.getCaloriesForUser);

    //TODO: get the steps, and total workouts so we can do calcs on them
    let stepsQuery = `query{getStepsForUser(user_id: "${USER_ID}"){user_id, amount, date}}`;
    let stepsList = await fetchinfo(stepsQuery, GRAPHQLURL);
    setUserStepsList(stepsList.getStepsForUser);

    let totalCals = caloriesList.getCaloriesForUser.reduce((acc, obj) => {
      return acc + obj.amount;
    }, 0);

    let totalSteps = stepsList.getStepsForUser.reduce((acc, obj) => {
      return acc + obj.amount;
    }, 0);
    allTimeCalcs(totalCals, totalSteps);
  };

  function allTimeCalcs(calories, steps) {
    if (calories != null && steps != null) {
      setUserCaloriesTotal(calories);
      setUserStepsTotal(steps);
    } else {
      let totalCals = userCaloriesList.reduce((acc, obj) => {
        return acc + obj.amount;
      }, 0);
      setUserCaloriesTotal(totalCals);

      let totalSteps = userStepsList.reduce((acc, obj) => {
        return acc + obj.amount;
      }, 0);
      setUserStepsTotal(totalSteps);
    }
  }

  const monthlyCalcs = () => {
    if (userCaloriesList) {
      let totalCals = {
        currentMonth: 0,
        previousMonth: 0,
      };
      userCaloriesList.forEach((obj) => {
        if (obj.date.includes(NOW.year().toString())) {
          let objRealDate = dayjs(obj.date);
          if (objRealDate.month() === NOW.month())
            totalCals.currentMonth += obj.amount;
          if (objRealDate.month() === NOW.month() - 1)
            totalCals.previousMonth += obj.amount;
        }
      });
      setUserCaloriesTotal(totalCals.currentMonth);
      setUserCaloriesPrevTotal(totalCals.previousMonth);
    }
    if (userStepsList) {
      let totalSteps = {
        currentMonth: 0,
        previousMonth: 0,
      };
      userStepsList.forEach((obj) => {
        if (obj.date.includes(NOW.year().toString())) {
          let objRealDate = dayjs(obj.date);
          if (objRealDate.month() === NOW.month())
            totalSteps.currentMonth += obj.amount;
          if (objRealDate.month() === NOW.month() - 1)
            totalSteps.previousMonth += obj.amount;
        }
      });
      setUserStepsTotal(totalSteps.currentMonth);
      setUserStepsPrevTotal(totalSteps.previousMonth);
    }
  };

  const weeklyCalcs = () => {
    if (userCaloriesList) {
      let totalCals = {
        currentWeek: 0,
        previousWeek: 0,
      };
      userCaloriesList.forEach((obj) => {
        if (obj.date.includes(NOW.year().toString())) {
          let objRealDate = dayjs(obj.date);
          if (objRealDate.week() === NOW.week())
            totalCals.currentWeek += obj.amount;
          if (objRealDate.week() === NOW.week() - 1)
            totalCals.previousWeek += obj.amount;
        }
      });
      setUserCaloriesTotal(totalCals.currentWeek);
      setUserCaloriesPrevTotal(totalCals.previousWeek);
    }
    if (userStepsList) {
      let totalSteps = {
        currentWeek: 0,
        previousWeek: 0,
      };
      userStepsList.forEach((obj) => {
        if (obj.date.includes(NOW.year().toString())) {
          let objRealDate = dayjs(obj.date);
          if (objRealDate.week() === NOW.week())
            totalSteps.currentWeek += obj.amount;
          if (objRealDate.week() === NOW.week() - 1)
            totalSteps.previousWeek += obj.amount;
        }
      });
      setUserStepsTotal(totalSteps.currentWeek);
      setUserStepsPrevTotal(totalSteps.previousWeek);
    }
  };

  const closeAllOtherButtonHandlers = () => {
    setShowAllTime(false);
    setShowWeekly(false);
    setShowMonthly(false);
  };
  const allTimeButtonHandler = () => {
    closeAllOtherButtonHandlers();
    setShowAllTime(true);
    allTimeCalcs();
  };
  const monthlyButtonHandler = () => {
    closeAllOtherButtonHandlers();
    setShowMonthly(true);
    monthlyCalcs();
  };
  const weeklyButtonHandler = () => {
    closeAllOtherButtonHandlers();
    setShowWeekly(true);
    weeklyCalcs();
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="box">
        <Typography variant="h5" style={{ textAlign: "center" }}>
          workout summaries
        </Typography>
      </Box>
      <Container
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "15px",
        }}
      >
        <Button
          color={showWeekly ? "secondary" : "primary"}
          onClick={() => weeklyButtonHandler()}
          style={{ textTransform: "none", width: "30%" }}
          variant="contained"
        >
          <Typography color="black" variant="subtitle1">
            weekly
          </Typography>
        </Button>

        <Button
          color={showMonthly ? "secondary" : "primary"}
          onClick={monthlyButtonHandler}
          style={{ textTransform: "none", width: "30%" }}
          variant="contained"
        >
          <Typography color="black" variant="subtitle1">
            monthly
          </Typography>
        </Button>
        <Button
          color={showAllTime ? "secondary" : "primary"}
          onClick={allTimeButtonHandler}
          style={{ textTransform: "none", width: "30%" }}
          variant="contained"
        >
          <Typography color="black" variant="subtitle1">
            all-time
          </Typography>
        </Button>
      </Container>

      <Container style={{ textAlign: "center" }}>
        {showAllTime && (
          <div className="box">
            <Typography marginBottom="10px" variant="h6" color="secondary">
              all time stats
            </Typography>
            <Typography variant="body1" color="text">
              total calories: {userCaloriesTotal}
            </Typography>
            <Typography variant="body1" color="text">
              total steps: {userStepsTotal}
            </Typography>
          </div>
        )}
        {showMonthly && (
          <div className="box">
            <Typography marginBottom="10px" variant="h6" color="secondary">
              this month's stats
            </Typography>
            <Typography variant="body1" color="text">
              total calories: {userCaloriesTotal}
            </Typography>
            <Typography variant="body1" color="text">
              total steps: {userStepsTotal}
            </Typography>
            <br />
            <Typography marginBottom="10px" variant="h6" color="secondary">
              last month's stats
            </Typography>
            <Typography variant="body1" color="text">
              total calories: {userCaloriesPrevTotal}
            </Typography>
            <Typography variant="body1" color="text">
              total steps: {userStepsThisPrevTotal}
            </Typography>
            <br />
            <Typography marginBottom="10px" variant="h6" color="secondary">
              so far this month:
            </Typography>
            {userCaloriesTotal !== 0 &&
              userCaloriesTotal - userCaloriesPrevTotal > 0 && (
                <Typography variant="h5" color="secondary.dark">
                  You have consumed{" "}
                  <b>{userCaloriesTotal - userCaloriesPrevTotal}</b> more
                  calories than last month!
                </Typography>
              )}
            {userCaloriesTotal !== 0 &&
              userCaloriesTotal - userCaloriesPrevTotal < 0 && (
                <Typography variant="h5" color="error.light">
                  You have consumed{" "}
                  <b>{userCaloriesPrevTotal - userCaloriesTotal}</b> less
                  calories than last month!
                </Typography>
              )}
            {userCaloriesTotal !== 0 &&
              userCaloriesTotal - userCaloriesPrevTotal === 0 && (
                <Typography variant="h5" color="secondary.dark">
                  You have consumed the <b>same</b> amount calories as last
                  month!
                </Typography>
              )}
            {userCaloriesTotal === 0 && (
              <Typography variant="h5" color="secondary.dark">
                You've logged no calories for this month. Better get trackin'!
              </Typography>
            )}
            <br />
            {userStepsTotal !== 0 &&
              userStepsTotal - userStepsThisPrevTotal > 0 && (
                <Typography variant="h5" color="secondary.dark">
                  You have done <b>{userStepsTotal - userStepsThisPrevTotal}</b>{" "}
                  more steps than last month!
                </Typography>
              )}
            {userStepsTotal !== 0 &&
              userStepsTotal - userStepsThisPrevTotal < 0 && (
                <Typography variant="h5" color="error.light">
                  You have done <b>{userStepsThisPrevTotal - userStepsTotal}</b>{" "}
                  less steps than last month... time to hustle!
                </Typography>
              )}
            {userStepsTotal !== 0 &&
              userStepsTotal - userStepsThisPrevTotal === 0 && (
                <Typography variant="h5" color="secondary.dark">
                  You have done the same amount steps as last month!
                </Typography>
              )}
            {userStepsTotal === 0 && (
              <Typography variant="h5" color="secondary.dark">
                You've logged no steps for this month. Better get back to
                trackin'!
              </Typography>
            )}
          </div>
        )}
        {showWeekly && (
          <div className="box">
            <Typography marginBottom="10px" variant="h6" color="secondary">
              this week's stats
            </Typography>
            <Typography variant="body1" color="text">
              total calories: {userCaloriesTotal}
            </Typography>
            <Typography variant="body1" color="text">
              total steps: {userStepsTotal}
            </Typography>
            <br />
            <Typography marginBottom="10px" variant="h6" color="secondary">
              last week's stats
            </Typography>
            <Typography variant="body1" color="text">
              total calories: {userCaloriesPrevTotal}
            </Typography>
            <Typography variant="body1" color="text">
              total steps: {userStepsThisPrevTotal}
            </Typography>
            <br />
            <Typography marginBottom="10px" variant="h6" color="secondary">
              so far this week:
            </Typography>
            {userCaloriesTotal !== 0 &&
              userCaloriesTotal - userCaloriesPrevTotal > 0 && (
                <Typography variant="h5" color="secondary.dark">
                  You have consumed{" "}
                  <b>{userCaloriesTotal - userCaloriesPrevTotal}</b> more
                  calories than last week!
                </Typography>
              )}
            {userCaloriesTotal !== 0 &&
              userCaloriesTotal - userCaloriesPrevTotal < 0 && (
                <Typography variant="h5" color="error.light">
                  You have consumed{" "}
                  <b>{userCaloriesPrevTotal - userCaloriesTotal}</b> less
                  calories than last week!
                </Typography>
              )}
            {userCaloriesTotal !== 0 &&
              userCaloriesTotal - userCaloriesPrevTotal === 0 && (
                <Typography variant="h5" color="secondary.dark">
                  You have consumed the same amount calories as last week!
                </Typography>
              )}
            {userCaloriesTotal === 0 && (
              <Typography variant="h5" color="secondary.dark">
                You've logged no calories for this month. Better get trackin'!
              </Typography>
            )}
            <br />
            {userStepsTotal !== 0 &&
              userStepsTotal - userStepsThisPrevTotal > 0 && (
                <Typography variant="h5" color="secondary.dark">
                  You have done <b>{userStepsTotal - userStepsThisPrevTotal}</b>{" "}
                  more steps than last week!
                </Typography>
              )}
            {userStepsTotal !== 0 &&
              userStepsTotal - userStepsThisPrevTotal < 0 && (
                <Typography variant="h5" color="error.light">
                  You have done <b>{userStepsThisPrevTotal - userStepsTotal}</b>{" "}
                  less steps than last week... time to hustle!
                </Typography>
              )}
            {userStepsTotal !== 0 &&
              userStepsTotal - userStepsThisPrevTotal === 0 && (
                <Typography variant="h5" color="secondary.dark">
                  You have done the same amount steps as last week!
                </Typography>
              )}
            {userStepsTotal === 0 && (
              <Typography variant="h5" color="secondary.dark">
                You've logged no steps for this week. Better get back to
                trackin'!
              </Typography>
            )}
          </div>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default SummaryComponent;
