import React, { useReducer, useState, useEffect } from "react";
import { Route, Link, Routes } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import HomeComponent from "./Components/HomeComponent";
import WorkoutComponent from "./Components/Workout/WorkoutComponent";

import {
  Toolbar,
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Snackbar,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";
import BurgerIcon from "@mui/icons-material/LunchDining";
import WorkoutIcon from "@mui/icons-material/FitnessCenter";
import ExtrasIcon from "@mui/icons-material/MoreHoriz";

import UserComponent from "./Components/UserComponent";
import CaloriesComponent from "./Components/CaloriesComponent";
import SummaryComponent from "./Components/Summary/SummaryPage";
import StepsCompoent from "./Components/Steps/StepsComponent";
import UserProfileComponent from "./Components/UserProfileComponent";

import WorkoutBackendComponent from "./Components/WorkoutBackend/WorkoutBackendComponent";
import ExerciseBackendComponent from "./Components/ExerciseBackend/ExerciseBackendComponent";
import NutritionComponent from "./Components/Nutrition/NutritionComponent";

const App = () => {
  // State Variables
  const initialState = {
    snackBarMsg: "",
    enableSnackbar: false,
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const getData = (data) => {
    setUsername(data.username);
    setPassword(data.password);
  };

  const snackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({
      enableSnackbar: false,
    });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const setSnackbarMsg = (msg) => {
    setState({ enableSnackbar: true, snackBarMsg: msg });
  };

  useEffect(() => {
    setUsername(window.sessionStorage.getItem( "user_id" ));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {/* *************** MENU BAR *************** */}
      {/* <AppBar color="tertiary" position="static">

        <Toolbar>
          <Typography variant="h6" color="secondary">
            FlexVisual
          </Typography>
          <IconButton
            onClick={handleClick}
            color="secondary"
            style={{ marginLeft: "auto", paddingRight: "1vh" }}
          >
            <MenuIcon />
          </IconButton>
          {window.sessionStorage.getItem("user_id") !== null ? (
            <div>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose} component={Link} to="/home">
                  Home
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} to="/users">
                  Users
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  component={Link}
                  to="/nutrition"
                >
                  Nutrition
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} to="/workout">
                  Workout
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  component={Link}
                  to="/workoutbackend"
                >
                  WorkoutBackend
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  component={Link}
                  to="/exercisebackend"
                >
                  ExerciseBackend
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} to="/calories">
                  Calories
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} to="/steps">
                  Steps
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} to="/summary">
                  Summary
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} to="/profile">
                  Profile
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <div>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose} component={Link} to="/home">
                  Home
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} to="/users">
                  Users
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar> */}
      {/* *********** COMPONENTS/PAGES *********** */}
      <div>
        <Routes>
          <Route path="/" element={<HomeComponent />} />
          <Route path="/home" element={<HomeComponent onSubmit={getData} />} />
          <Route path="/users" element={<UserComponent />} />
          <Route path="/nutrition" element={<NutritionComponent />} />
          <Route path="/workout" element={<WorkoutComponent />} />
          <Route path="/workoutbackend" element={<WorkoutBackendComponent />} />
          <Route
            path="/exercisebackend"
            element={<ExerciseBackendComponent />}
          />
          <Route
            path="/extras"
            element={
              <UserProfileComponent username={username} password={password} />
            }
          />

          <Route path="/calories" element={<CaloriesComponent />} />
          <Route path="/summary" element={<SummaryComponent />} />
          <Route path="/steps" element={<StepsCompoent />} />
          <Route
            path="/profile"
            element={
              <UserProfileComponent username={username} password={password} />
            }
          />
        </Routes>
      </div>

      <Snackbar
        open={state.enableSnackbar}
        message={state.snackBarMsg}
        autoHideDuration={3000}
        onClose={snackbarClose}
      />

      {username && (
        <BottomNavigation
          showLabels
          style={{ position: "fixed", bottom: "0px", width: "100%" }}
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          sx={{
            bgcolor: "black",
            "& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label": {
              color: (theme) => theme.palette.secondary.main,
            },
            "& .Mui-selected": {
              "& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label": {
                color: (theme) => theme.palette.primary.main,
              },
            },
          }}
        >
          <BottomNavigationAction
            label="home"
            icon={<HomeIcon color="secondary" />}
            component={Link}
            to="/home"
          />
          <BottomNavigationAction
            label="steps"
            icon={<MapIcon />}
            component={Link}
            to="/steps"
          />
          <BottomNavigationAction
            label="nutrition"
            icon={<BurgerIcon />}
            component={Link}
            to="/nutrition"
          />
          <BottomNavigationAction
            label="workouts"
            icon={<WorkoutIcon />}
            component={Link}
            to="/workout"
          />
          <BottomNavigationAction
            label="extras"
            icon={<ExtrasIcon />}
            component={Link}
            to="/extras"
          />
        </BottomNavigation>
      )}
    </ThemeProvider>
  );
};
export default App;
