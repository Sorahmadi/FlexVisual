import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Route, Link, Routes, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import UserComponent from "../Components/UserComponent";
import SummaryPage from "./Summary/SummaryPage";

import dayjs from "dayjs";

import theme from "../theme";
import logo from "../images/image.png";
import "../header.css";

const HomeComponent = (props) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = React.useState(false);
  const [openRegister, setOpenRegister] = React.useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  const [userCalories, setUserCalories] = useState([]);
  const [weekTotal, setWeekTotal] = useState(0);

  const [steps, setSteps] = useState([]);
  const [todaySteps, setTodaySteps] = useState(0);

  const [vertical, setVertical] = useState("top");
  const [horizontal, setHorizontal] = useState("center");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [msg, setMsg] = useState("");

  const [notify, setNotify] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState(
    "You have no steps logged today, keep up to date by logging steps!"
  );

  //Randomly chooses steps or cals to display
  const [randMessage, setRandMessage] = useState(0);

  const onHandleNotifyClose = function (e) {
    setNotify(false);
  };

  const handleNotifyMessages = function (e) {
    let randomMes = Math.floor(Math.random() * 6) + 1;
    setRandMessage(randomMes);
  };

  const onUsernameChange = function (e) {
    setUsername(e.target.value.toLowerCase());
  };
  const onPasswordChange = function (e) {
    setPassword(e.target.value);
  };

  const onFirstNameChange = function (e) {
    setFirstName(e.target.value);
  };
  const onLastNameChange = function (e) {
    setLastName(e.target.value);
  };

  //On page load check if there is a user_id
  useEffect(() => {
    if (window.sessionStorage.getItem("user_id")) {
      setLoggedIn(true);
      setNotify(true);
      handleNotifyMessages();
      getStepsForUser();
      getCaloriesForUser();
      getUsers();
    } else {
      setLoggedIn(false);
    }
  }, []);

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

      let total = 0;
      json.data.getCaloriesForUser.forEach((entry) => {
        total += entry.amount;
      });
      calcTotals(json.data.getCaloriesForUser);
    } catch (error) {
      console.log(`Problem getting calories for user - ${error.message}`);
    }
  };

  const calcTotals = async (userCalories) => {
    let weekTotal = 0;

    userCalories.forEach((entry) => {
      let date = entry.date;

      let calc = (Date.parse(date) - new Date().getTime()) / (1000 * 3600 * 24);

      if (calc >= -7) {
        weekTotal += entry.amount;
      }
      setWeekTotal(weekTotal);
    });
  };

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

      setNotify(true);
      setNotifyMessage(
        "You have done " + currentSteps.amount + " step(s) today!"
      );
    } catch (error) {
      console.log(`Problem getting steps - ${error.message}`);
    }
  };

  const handleClickOpen = () => {
    setMsg("");
    setOpen(true);
  };

  const handleClickOpenRegister = () => {
    setMsg("");
    setOpenRegister(true);
  };

  const handleClose = () => {
    tryLogin();
    setOpen(false);
  };

  const handleCloseRegister = () => {
    setOpenRegister(false);
  };

  //Get user by username query
  const getUserByUsernamePassword = async (username, password) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let query = JSON.stringify({
        query: `query{getUserByUsernamePassword(username: "${username}", password: "${password}"){_id, username, password, first, last}}`,
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
      console.log(json.data);
      //If we found the user
      if (json.data.getUserByUsernamePassword.length > 0) {
        setLoggedIn(true);
        setUser(json.data.getUserByUsernamePassword[0]);
        window.sessionStorage.setItem(
          "user_id",
          json.data.getUserByUsernamePassword[0]._id
        );

        //Clear text inputs
        setUsername("");
        setPassword("");

        window.location.reload();
      }
    } catch (error) {
      console.log(`Problem getting the user by username - ${error.message}`);
    }
  };

  //Try to log in
  const tryLogin = async () => {
    // Check that username and password are not blank
    if (username !== "" && password !== "") {
      //Check if it matches a user in the DB
      getUserByUsernamePassword(username, password);
      props.onSubmit({ username: username, password: password });
    }
  };

  //Logout and remove user from sessionid
  const logout = async () => {
    // Check that username and password are not blank
    setLoggedIn(false);
    window.sessionStorage.removeItem("user_id");
    window.location.reload();
    props.onSubmit({ username: "", password: "" });
  };

  //Add User Query
  const addUser = async () => {
    //Clear old data
    setUsername("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setMsg("");

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
      let query = JSON.stringify({
        query: `mutation{addUser(username: "${username.toLowerCase()}", password: "${password}", first: "${firstName}", last: "${lastName}") {first, last}}`,
      });

      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });
      //Send the query
      await response.json();

      if (response.ok) {
        setOpenRegister(false);
        setMsg("Successfully Added User");
      } else {
        setMsg(`Problem adding user - ${response.statusText}`);
      }
    } catch (error) {
      console.log(`Problem adding user - ${error.message}`);
      setMsg(`Problem adding user - ${error.message}`);
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
      {!loggedIn && (
        <div className="centerAlign" style={{ paddingTop: "10%" }}>
          <img src={logo} alt="Logo" height="30%" width="80%" />
        </div>
      )}

      <Typography
        variant="h5"
        style={{ textAlign: "center", paddingTop: "10%" }}
      >
        Welcome to Flex Visual
      </Typography>
      <Typography
        variant="body"
        color="primary"
        style={{ textAlign: "center" }}
      >
        {msg}
      </Typography>
      <br />
      {loggedIn ? (
        <div>
          <Typography
            variant="h6"
            color="tertiary"
            style={{ textAlign: "center" }}
          >
            Hello {user.first || user.username}!
          </Typography>

          <div style={{ textAlign: "center" }}>
            <br />
            <Button
              color="primary"
              onClick={logout}
              style={{
                display: "block",
                margin: "auto",
                textTransform: "none",
                width: "60%",
              }}
              variant="contained"
            >
              <Typography color="black" variant="subtitle1">
                log out
              </Typography>
            </Button>

            <Box className="box">
              <SummaryPage />
            </Box>

            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              message={notifyMessage}
              color="primary"
              open={notify}
              autoHideDuration={6000}
              onClose={onHandleNotifyClose}
            />
          </div>
        </div>
      ) : (
        <div>
          <br />

          <Button
            color="primary"
            onClick={handleClickOpen}
            style={{
              display: "block",
              margin: "auto",
              textTransform: "none",
              width: "60%",
            }}
            variant="contained"
          >
            <Typography color="black" variant="subtitle1">
              sign in
            </Typography>
          </Button>
          <br />
          <Button
            color="primary"
            onClick={handleClickOpenRegister}
            style={{
              display: "block",
              margin: "auto",
              textTransform: "none",
              width: "60%",
            }}
            variant="contained"
          >
            <Typography color="black" variant="subtitle1">
              register
            </Typography>
          </Button>
        </div>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>sign in</DialogTitle>
        <DialogContent>
          <div className="textfield_main">
            <TextField
              autoFocus
              id="username"
              label="Username"
              fullWidth
              margin="normal"
              variant="outlined"
              color="tertiary"
              onChange={onUsernameChange}
            />
          </div>
          <br />
          <div className="textfield_main">
            <TextField
              id="password"
              label="Password"
              fullWidth
              color="tertiary"
              onChange={onPasswordChange}
            />
          </div>
          <br />
        </DialogContent>
        <Button
          color="primary"
          onClick={handleClose}
          style={{
            display: "block",
            margin: "auto",
            textTransform: "none",
            width: "40%",
          }}
          variant="contained"
        >
          <Typography color="black" variant="subtitle1">
            login
          </Typography>
        </Button>
        <br />
      </Dialog>

      <Dialog open={openRegister} onClose={handleCloseRegister}>
        <DialogTitle>register</DialogTitle>
        <DialogContent>
          <div className="textfield_main">
            <TextField
              autoFocus
              label="Username"
              value={username}
              onChange={onUsernameChange}
              fullWidth
              margin="normal"
              variant="outlined"
              color="tertiary"
            />
            <br />
            <TextField
              label="Password"
              value={password}
              onChange={onPasswordChange}
              fullWidth
              margin="normal"
              variant="outlined"
              color="tertiary"
            />
            <br />
            <TextField
              label="First Name"
              value={firstName}
              onChange={onFirstNameChange}
              fullWidth
              margin="normal"
              variant="outlined"
              color="tertiary"
            />
            <br />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={onLastNameChange}
              fullWidth
              margin="normal"
              variant="outlined"
              color="tertiary"
            />
            <br />
            <Typography
              variant="body"
              color="error"
              style={{ textAlign: "center" }}
              fullWidth
              margin="normal"
            >
              {msg}
            </Typography>
          </div>
        </DialogContent>
        <Button
          color="primary"
          onClick={addUser}
          style={{
            display: "block",
            margin: "auto",
            textTransform: "none",
            width: "40%",
          }}
          variant="contained"
        >
          <Typography color="black" variant="subtitle1">
            sign up
          </Typography>
        </Button>
        <br />
      </Dialog>
      <div>
        <Routes>
          <Route path="/users" element={<UserComponent />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
};
export default HomeComponent;

//Test tutorial comment
