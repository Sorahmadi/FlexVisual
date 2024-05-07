import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

import { ThemeProvider } from "@mui/material/styles";
import { Box, Button, Container, Typography } from "@mui/material";

import theme from "../../theme";
import "../../App.css";
import fireImg from "../../images/fire.png";

import StepsInputModal from "./StepsInputModal";
import StepsGoalInputModal from "./StepsGoalInputModal";
import StepsChart from "./StepsChart";

const StepsComponent = () => {
  // const USER_ID = "635b5380025fdd9e3ee59b18"; // hardcoded for now

  const [todaySteps, setTodaySteps] = useState(0);
  const [steps, setSteps] = useState([]);
  const [user, setUser] = useState({});
  const [inputModalOpen, setInputModalOpen] = useState(false);
  const [goalModalOpen, setGoalModalOpen] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem("user_id")) {
      getUsers();
      getStepsForUser();
    }
  }, []);

  const getStepsForUser = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let query = JSON.stringify({
        query: `query { getStepsForUser(user_id: "${window.sessionStorage.getItem(
          "user_id"
        )}") { _id, user_id, amount, date } }`,
      });

      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });

      let json = await response.json();
      let sortedSteps = json.data.getStepsForUser.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setSteps(sortedSteps);

      let currentSteps = sortedSteps.find(
        (s) => s.date == dayjs().format("YYYY-MM-DD")
      );

      setTodaySteps(currentSteps.amount || 0);
    } catch (error) {
      console.log(`Problem getting steps - ${error.message}`);
    }
  };

  const getUsers = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let query = JSON.stringify({
        query: `query{getAllUsers{_id, username, password, first, last, stepsgoal}}`,
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

      setUser(
        json.data.getAllUsers.find(
          (u) => u._id === window.sessionStorage.getItem("user_id")
        )
      );
    } catch (error) {
      console.log(`Problem getting users - ${error.message}`);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        {/* page title */}
        <Box className="box">
          <Typography variant="h5" style={{ textAlign: "center" }}>
            steps
          </Typography>
        </Box>

        {/* distance */}
        <Box className="box">
          <Typography variant="h6" marginBottom="10px" textAlign="center">
            total distance walked today
          </Typography>

          <img src={fireImg} className="fireImg" />

          <Typography
            color="secondary"
            fontWeight="700"
            position="relative"
            textAlign="center"
            top="-2.125rem" // height of h4
            variant="h4"
          >
            {/* 1200 steps / km */}
            <b>{(todaySteps / 1200).toFixed(2)} km</b>
          </Typography>

          <Button
            color="primary"
            onClick={() => setInputModalOpen(true)}
            style={{
              display: "block",
              margin: "auto",
              position: "relative",
              textTransform: "none",
              top: "-20px",
              width: "60%",
            }}
            variant="contained"
          >
            <Typography color="black" variant="subtitle1">
              input steps
            </Typography>
          </Button>
        </Box>

        {/* goal */}
        {user.stepsgoal > 0 && (
          <Box className="box">
            <Typography marginBottom="10px" textAlign="center" variant="h6">
              today's step goal
            </Typography>

            <Box backgroundColor="#0097A0" borderRadius="5px" height="40px">
              <Box
                backgroundColor="#FF8514"
                borderRadius="5px"
                height="40px"
                width={
                  todaySteps >= user.stepsgoal
                    ? "100%"
                    : `${(todaySteps / user.stepsgoal) * 100}%`
                }
              ></Box>
            </Box>

            <Typography
              position="relative"
              textAlign="center"
              top="-2.125rem" // height of h4
              variant="h6"
            >
              {todaySteps}/{user.stepsgoal}
            </Typography>

            <Button
              color="primary"
              onClick={() => {
                setGoalModalOpen(true);
              }}
              style={{
                display: "block",
                margin: "auto",
                width: "60%",
                position: "relative",
                textTransform: "none",
                top: "-15px",
              }}
              variant="contained"
            >
              <Typography color="black" variant="subtitle1">
                set goal
              </Typography>
            </Button>
          </Box>
        )}

        {/* recent activity */}
        <Box className="box">
          <Typography marginBottom="10px" textAlign="center" variant="h6">
            recent activity
          </Typography>

          {steps && steps.length > 0 ? (
            <StepsChart steps={steps} />
          ) : (
            <Typography variant="body1">No Step Data</Typography>
          )}
        </Box>
      </Container>

      <StepsInputModal
        open={inputModalOpen}
        onCancel={() => setInputModalOpen(false)}
        reloadUserSteps={() => getStepsForUser()}
        usersteps={steps}
      />

      <StepsGoalInputModal
        open={goalModalOpen}
        onCancel={() => setGoalModalOpen(false)}
        reloadUserGoals={() => getUsers()}
        user={user}
      />
    </ThemeProvider>
  );
};

export default StepsComponent;
