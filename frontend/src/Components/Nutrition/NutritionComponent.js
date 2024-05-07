//#region Imports
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { ThemeProvider } from "@mui/material/styles";
import {
  TextField,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Container,
} from "@mui/material";
import Calendar from "react-calendar";
import CaloriesChart from "./CaloriesChart";
import theme from "../../theme";
import "../../App.css";
//#endregion

const NutritionComponent = () => {
  //#region State Variables
  //State variables
  const [user, setUser] = useState({});
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState("");

  const [todayTotal, setTodayTotal] = useState(0);
  const [weekTotal, setWeekTotal] = useState(0);
  const [monthTotal, setMonthTotal] = useState(0);

  const [calories, setCalories] = useState(0);
  const [inputDialogOpen, setInputDialogOpen] = React.useState(false);
  const [updateStatsDialogOpen, setUpdateStatsDialogOpen] =
    React.useState(false);

  const [date, setDate] = React.useState(new Date());
  const [userCalories, setUserCalories] = useState([]);
  useEffect(() => {
    getCaloriesForUser();
    getUserByID();
  }, []);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  //#endregion

  //#region On Change Methods
  const onCaloriesChange = (e) => {
    setCalories(e.target.value);
  };
  const handleInputDialogClose = () => {
    setInputDialogOpen(false);
  };
  const handleUpdateStatsDialogClose = () => {
    setUpdateStatsDialogOpen(false);
  };
  const onWeightChange = (e) => {
    setWeight(e.target.value);
  };
  const onHeightChange = (e) => {
    setHeight(e.target.value);
  };

  //#endregion

  const BMI = (height, weight) => {
    let kg = weight / 2.205;

    let m = parseInt(height?.split("'")[0]) / 3.281;
    m += height?.split("'")[1] / 39.37;

    //BMI = weight ÷ height^2
    return (kg / (m * m)).toFixed(1);
  };

  const calcTotals = async (userCalories) => {
    let todayTotal = 0;
    let weekTotal = 0;
    let monthTotal = 0;

    userCalories.forEach((entry) => {
      let date = entry.date;

      let calc = (Date.parse(date) - new Date().getTime()) / (1000 * 3600 * 24);

      if (calc >= -1) {
        todayTotal += entry.amount;
      }
      if (calc >= -7) {
        weekTotal += entry.amount;
      }
      if (calc >= -30) {
        monthTotal += entry.amount;
      }
    });

    setTodayTotal(todayTotal);
    setWeekTotal(weekTotal);
    setMonthTotal(monthTotal);
  };

  const setDateAndOpenDialog = (newValue) => {
    setDate(newValue);
    //If no value on date open Input Dialog
    setInputDialogOpen(true);

    //If value on date, open edit dialog
  };

  const findCaloriesForDate = (date) => {
    let total = 0;
    userCalories.forEach((entry) => {
      if (Date.parse(entry.date) === date.getTime()) {
        total += entry.amount;
      }
    });
    return total;
  };

  const setCaloriesForDate = (date) => {
    handleInputDialogClose();
    deleteCalories(date);

    if (calories !== 0) addCalories(date);
  };

  const tileDisabled = ({ activeStartDate, date, view }) => {
    return (
      date < new Date(new Date().getFullYear(), new Date().getMonth(), 1) ||
      date >
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()
        )
    );
  };

  const tileClassName = ({ date, view }) => {
    if (userCalories.find((x) => Date.parse(x.date) === date.getTime())) {
      return "hasCalories";
    }
  };

  //#region Database Queries
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

  const addCalories = async () => {
    handleInputDialogClose();

    if (calories === 0) {
      return;
    }

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
      let query = JSON.stringify({
        query: `mutation{addCalories(user_id: "${window.sessionStorage.getItem(
          "user_id"
        )}", amount: ${calories}, date: "${new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        )}") {user_id, amount, date}}`,
      });
      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });

      //Send query
      await response.json();

      //Reload the calories
      getCaloriesForUser();

      setCalories(0);
    } catch (error) {
      console.log(`Problem updating calories - ${error.message}`);
    }
  };
  const deleteCalories = async (date) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let query = JSON.stringify({
        query: `mutation{deleteCalories(user_id: "${window.sessionStorage.getItem(
          "user_id"
        )}", date: "${new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        )}") {user_id, date}}`,
      });

      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });

      //Set the query
      await response.json();

      //Get all calories to refresh the list
      getCaloriesForUser();
    } catch (error) {
      console.log(`Problem deleting calories - ${error.message}`);
    }
  };

  //Get user by id query
  const getUserByID = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let query = JSON.stringify({
        query: `query{getUserByID(user_id: "${window.sessionStorage.getItem(
          "user_id"
        )}"){_id, username, password, first, last, weight, height, stepsgoal}}`,
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
      setUser(json.data.getUserByID);
      setHeight(json.data.getUserByID.height);
      setWeight(json.data.getUserByID.weight);
    } catch (error) {
      console.log(`Problem getting the user by id - ${error.message}`);
    }
  };
  const updateUser = async () => {
    handleUpdateStatsDialogClose();

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
      let query = JSON.stringify({
        query: `mutation{updateUser(_id: "${window.sessionStorage.getItem(
          "user_id"
        )}",  username: "${user.username}", password: "${
          user.password
        }", first: "${user.first}", last: "${
          user.last
        }", weight: ${weight}, height: "${height}", stepsgoal: ${
          user.stepsgoal || 0
        }) {_id, username, password, first, last, weight, height, stepsgoal}}`,
      });
      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });

      //Send query
      await response.json();

      getUserByID(window.sessionStorage.getItem("user_id"));
    } catch (error) {
      console.log(`Problem updating users - ${error.message}`);
    }
  };
  //#endregion

  return (
    //#region JSX
    <ThemeProvider theme={theme}>
      <Container className="box">
        <Typography
          variant="h5"
          color="tertiary"
          style={{ textAlign: "center" }}
        >
          nutrition
        </Typography>
        <br />
        <Typography
          variant="h6"
          color="tertiary"
          style={{ textAlign: "center" }}
        >
          {monthNames[dayjs().month()]} input calories
        </Typography>
        <br />
        <Calendar
          onChange={setDateAndOpenDialog}
          value={date}
          tileDisabled={tileDisabled}
          tileClassName={tileClassName}
        />
        <br />
        <Typography
          variant="h6"
          color="tertiary"
          style={{ textAlign: "center" }}
        >
          calorie counts
        </Typography>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div style={{ width: "30%" }}>
            <Typography
              variant="h6"
              color="tertiary"
              style={{ textAlign: "center" }}
            >
              today
            </Typography>

            <Typography
              variant="h4"
              color="secondary"
              style={{ textAlign: "center", fontWeight: "bold" }}
            >
              {todayTotal}
            </Typography>
          </div>
          <div style={{ width: "30%" }}>
            <Typography
              variant="h6"
              color="tertiary"
              style={{ textAlign: "center" }}
            >
              week
            </Typography>

            <Typography
              variant="h4"
              color="secondary"
              style={{ textAlign: "center", fontWeight: "bold" }}
            >
              {weekTotal}
            </Typography>
          </div>
          <div style={{ width: "30%" }}>
            <Typography
              variant="h6"
              color="tertiary"
              style={{ textAlign: "center" }}
            >
              month
            </Typography>

            <Typography
              variant="h4"
              color="secondary"
              style={{ textAlign: "center", fontWeight: "bold" }}
            >
              {monthTotal}
            </Typography>
          </div>
        </div>
        <br />
        <br />
        <Typography
          variant="h6"
          color="tertiary"
          style={{ textAlign: "center" }}
        >
          recent calories
        </Typography>
        <CaloriesChart calories={userCalories} />
        <br />
        <br />
        <Typography
          variant="h6"
          color="tertiary"
          style={{ textAlign: "center" }}
        >
          stats
        </Typography>
        <br />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div style={{ width: "40%" }}>
            <Typography
              variant="h6"
              color="tertiary"
              style={{ textAlign: "center" }}
            >
              weight
            </Typography>
            {user.weight !== null ? (
              <Typography
                variant="h4"
                color="secondary"
                style={{ textAlign: "center", fontWeight: "bold" }}
              >
                {user.weight} lb
              </Typography>
            ) : (
              <Typography
                variant="h4"
                color="secondary"
                style={{ textAlign: "center", fontWeight: "bold" }}
              >
                -
              </Typography>
            )}
          </div>
          <div style={{ width: "40%" }}>
            <Typography
              variant="h6"
              color="tertiary"
              style={{ textAlign: "center" }}
            >
              height
            </Typography>
            {user.height !== null ? (
              <Typography
                variant="h4"
                color="secondary"
                style={{ textAlign: "center", fontWeight: "bold" }}
              >
                {user.height}
              </Typography>
            ) : (
              <Typography
                variant="h4"
                color="secondary"
                style={{ textAlign: "center", fontWeight: "bold" }}
              >
                -
              </Typography>
            )}
          </div>
        </div>
        <br />
        <Typography
          variant="h6"
          color="tertiary"
          style={{ textAlign: "center" }}
        >
          BMI
        </Typography>
        {user.weight !== null && user.height !== null ? (
          <Typography
            variant="h4"
            color="secondary"
            style={{ textAlign: "center", fontWeight: "bold" }}
          >
            {BMI(user.height, user.weight)}
          </Typography>
        ) : (
          <Typography
            variant="h4"
            color="secondary"
            style={{ textAlign: "center", fontWeight: "bold" }}
          >
            -
          </Typography>
        )}
        <br />
        <br />
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <Button
            color="primary"
            style={{ textTransform: "none", width: "50%" }}
            variant="contained"
            onClick={() => setUpdateStatsDialogOpen(true)}
          >
            <Typography color="black" variant="subtitle1">
              update stats
            </Typography>
          </Button>
        </div>
        <br />
      </Container>
      <Dialog open={inputDialogOpen} onClose={handleInputDialogClose}>
        <DialogTitle>Add Calories</DialogTitle>
        <DialogContentText style={{ textAlign: "center" }}>
          {date.toLocaleDateString("en-US")}
        </DialogContentText>
        <DialogContentText style={{ textAlign: "center" }}>
          Current Calories: {findCaloriesForDate(date)}
        </DialogContentText>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="calories"
            label="Input Calories"
            type="number"
            variant="standard"
            onChange={onCaloriesChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={handleInputDialogClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => addCalories()}
          >
            Add
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => setCaloriesForDate(date)}
          >
            Set
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={updateStatsDialogOpen}
        onClose={handleUpdateStatsDialogClose}
      >
        <DialogTitle>Your Stats</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="weight"
            value={weight || ""}
            type="number"
            label="Weight"
            variant="standard"
            onChange={onWeightChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="height"
            value={height || ""}
            label="Height"
            variant="standard"
            onChange={onHeightChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={handleUpdateStatsDialogClose}
          >
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={updateUser}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
    //#endregion
  );
};

export default NutritionComponent;
