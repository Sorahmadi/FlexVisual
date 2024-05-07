import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Container,
  Typography,
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  DialogContentText,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import theme from "../../theme";
import "../../App.css";
import fireImg from "../../images/fire.png";
import FindWorkoutModal from "./FindWorkoutModal";
import CreateWorkoutModal from "./CreateWorkoutModal";
import WorkoutInProgressModal from "./WorkoutInProgressModal";
import WorkoutChart from "./WorkoutChart";

const WorkoutComponent = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Exercise Objects
  const [userExercises, setUserExercises] = useState([]);
  const [presetExercises, setPresetExercises] = useState([]);
  const [allExercises, setAllExercises] = useState([]);

  // Workout Objects
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [presetWorkouts, setPresetWorkouts] = useState([]);
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState({});

  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [completedWorkoutsCount, setCompletedWorkoutsCount] = useState(0);

  // Modal Open Objects
  const [findWorkoutModalOpen, setFindWorkoutModalOpen] = useState(false);
  const [createWorkoutModalOpen, setCreateWorkoutModalOpen] = useState(false);
  const [workoutInProgressModalOpen, setWorkoutInProgressModalOpen] =
    useState(false);
  const [openShareCodeInputDialog, setOpenShareCodeInputDialog] =
    React.useState(false);
  const [openNotASubscriberDialog, setOpenNotASubscriberDialog] =
    React.useState(false);

  const [sharecodeInput, setSharecodeInput] = useState("");

  const onShareCodeChange = function (e) {
    setSharecodeInput(e.target.value);
  };

  const handleShareCodeInputDialogClose = () => {
    setOpenShareCodeInputDialog(false);
  };

  const handleNotASubscriberDialogClose = () => {
    setOpenNotASubscriberDialog(false);
  };

  //On this page load, get the exercises
  useEffect(() => {
    getExercisesForUser();
    getWorkouts();
    getCompletedWorkouts();
    getUserByID();
  }, []);

  const calcNumberWorkoutsThisMonth = async (completedWorkouts) => {
    let total = 0;
    completedWorkouts.forEach((entry) => {
      let date = entry.datecompleted;

      let calc = (Date.parse(date) - new Date().getTime()) / (1000 * 3600 * 24);

      if (calc >= -30) {
        total += 1;
      }
      setCompletedWorkoutsCount(total);
    });
  };

  const selectAndStartWorkout = (workout) => {
    setSelectedWorkout(workout);
    setWorkoutInProgressModalOpen(true);
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
      getSubscription(json.data.getUserByID);

      //Check if user is subscribed
    } catch (error) {
      console.log(`Problem getting the user by id - ${error.message}`);
    }
  };

  const getSubscription = async (user) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let query = JSON.stringify({
        query: `query{getSubscribers(username: "${user.username}"){_id, firstname, lastname, address, email, username, amount}}`,
      });

      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });
      let json = await response.json();

      if (json.data.getSubscribers.length < 1) {
        setIsSubscribed(false);
      } else {
        setIsSubscribed(true);
      }
    } catch (error) {
      console.log(
        `Problem getting the subscriber by username - ${error.message}`
      );
    }
  };

  //Get exercises queries
  const getExercisesForUser = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let query = JSON.stringify({
        query: `query{getUserExercises(user_id: "${window.sessionStorage.getItem(
          "user_id"
        )}"){_id, createdby, type, name, description, muscleGroup, reps, weight}}`,
      });

      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });

      //Send the query
      let userExercisesJson = await response.json();

      query = JSON.stringify({
        query: `query{getPresetExercises{_id, createdby, type, name, description, muscleGroup, reps, weight}}`,
      });

      let response2 = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });

      //Send the query
      let presetExercisesJson = await response2.json();

      //Set all exercises data to the result
      setUserExercises(userExercisesJson.data.getUserExercises);
      setPresetExercises(presetExercisesJson.data.getPresetExercises);
      setAllExercises(
        userExercisesJson.data.getUserExercises.concat(
          presetExercisesJson.data.getPresetExercises
        )
      );
    } catch (error) {
      console.log(`Problem getting exercises - ${error.message}`);
    }
  };

  //Get workouts queries
  const getWorkouts = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let query = JSON.stringify({
        query: `query{getUserWorkouts(user_id: "${window.sessionStorage.getItem(
          "user_id"
        )}"){_id, createdby, subscribers, type, name, description, exercises, sharecode}}`,
      });

      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });

      //Send the query
      let userWorkoutsJson = await response.json();
      let userWorkouts = userWorkoutsJson.data.getUserWorkouts;

      query = JSON.stringify({
        query: `query{getSubscribedWorkouts(user_id: "${window.sessionStorage.getItem(
          "user_id"
        )}"){_id, createdby, subscribers, type, name, description, exercises, sharecode}}`,
      });

      let response2 = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });

      let subscribedWorkoutsJson = await response2.json();
      let subscribedWorkouts =
        subscribedWorkoutsJson.data.getSubscribedWorkouts;

      query = JSON.stringify({
        query: `query{getPresetWorkouts{_id, createdby, type, name, description, exercises}}`,
      });

      let response3 = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });

      let presetWorkoutsJson = await response3.json();
      let presetWorkouts = presetWorkoutsJson.data.getPresetWorkouts;

      //Set all workout data to the result
      setUserWorkouts(userWorkouts.concat(subscribedWorkouts));
      setPresetWorkouts(presetWorkouts);
      setAllWorkouts(
        userWorkouts.concat(subscribedWorkouts).concat(presetWorkouts)
      );
    } catch (error) {
      console.log(`Problem getting workouts - ${error.message}`);
    }
  };

  const getCompletedWorkouts = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let query = JSON.stringify({
        query: `query{getUserCompletedWorkouts(user_id: "${window.sessionStorage.getItem(
          "user_id"
        )}"){_id, user_id, workout_id, datecompleted}}`,
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

      setCompletedWorkouts(json.data.getUserCompletedWorkouts);
      calcNumberWorkoutsThisMonth(json.data.getUserCompletedWorkouts);
    } catch (error) {
      console.log(`Problem getting completedworkouts - ${error.message}`);
    }
  };

  //Add workout from Code Query
  const getWorkoutFromCode = async () => {
    //Close modal
    handleShareCodeInputDialogClose();

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
      let query = JSON.stringify({
        query: `query{getWorkoutByShareCode(sharecode: "${sharecodeInput}"){_id, createdby, subscribers, type, name, description, exercises, sharecode}}`,
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

      setSharecodeInput("");
      subscribeToWorkout(json.data.getWorkoutByShareCode);
    } catch (error) {
      console.log(`Problem finding workout from sharecode - ${error.message}`);
    }
  };

  //Add Workout Query
  const subscribeToWorkout = async (workout) => {
    let subs = workout.subscribers;
    subs.push(`${window.sessionStorage.getItem("user_id")}`);

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
      let query = JSON.stringify({
        query: `mutation{subscibeToWorkout(workout_id: "${
          workout._id
        }", subscribers: ${JSON.stringify(
          subs
        )}) {_id, subscribers, type, name, description, exercises, sharecode}}`,
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

      //Reset Workouts
      getWorkouts();
    } catch (error) {
      console.log(`Problem adding workout - ${error.message}`);
    }
  };

  const getWorkoutByID = (id) => {
    return allWorkouts.find((workout) => {
      return workout._id === id;
    });
  };

  const getExerciseByID = (id) => {
    return allExercises.find((exercise) => {
      return exercise._id === id;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        {/* page title */}
        <Box className="box">
          <Typography variant="h5" style={{ textAlign: "center" }}>
            workouts
          </Typography>
        </Box>

        {/* distance */}
        <Box className="box">
          <Typography variant="h6" marginBottom="10px" textAlign="center">
            total workouts this month
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
            <b>{completedWorkoutsCount}</b>
          </Typography>

          <Button
            color="primary"
            style={{
              display: "block",
              margin: "auto",
              textTransform: "none",
              width: "60%",
            }}
            variant="contained"
          >
            <Typography
              color="black"
              variant="subtitle1"
              onClick={() => setFindWorkoutModalOpen(true)}
            >
              find workout
            </Typography>
          </Button>

          <br />

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              color="primary"
              style={{
                display: "block",
                textTransform: "none",
                width: "50%",
                borderTopRightRadius: "0%",
                borderBottomRightRadius: "0%",
              }}
              variant="contained"
            >
              <Typography
                color="black"
                variant="subtitle1"
                onClick={
                  userWorkouts.length === 5 && !isSubscribed
                    ? () => setOpenNotASubscriberDialog(true)
                    : () => setCreateWorkoutModalOpen(true)
                }
              >
                create workout
              </Typography>
            </Button>
            <div
              style={{
                border: "1px solid rgba(0, 151, 160,1)",
                borderLeft: "none",
                borderTopRightRadius: "10%",
                borderBottomRightRadius: "10%",
              }}
            >
              <IconButton onClick={() => setOpenShareCodeInputDialog(true)}>
                <CloudDownloadIcon />
              </IconButton>
            </div>
          </div>
        </Box>

        <Box className="box">
          {completedWorkouts.length ? (
            <div>
              <Typography variant="h6" marginBottom="10px" textAlign="center">
                quick start recent workout
              </Typography>

              {completedWorkouts
                .slice(
                  0,
                  completedWorkouts.length > 4 ? 4 : completedWorkouts.length
                )
                .map((workout, index) => (
                  <div key={index}>
                    <Box display="flex" justifyContent="center">
                      <Accordion sx={{ width: 300, bgcolor: "secondary.main" }}>
                        <AccordionSummary
                          expandIcon={<ExpandMore />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography color="black" variant="subtitle1">
                            {getWorkoutByID(workout.workout_id)?.name || ""}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography
                            color="black"
                            variant="subtitle1"
                            sx={{ textDecoration: "underline" }}
                          >
                            Included Exercises
                          </Typography>
                          {getWorkoutByID(workout.workout_id)?.exercises.map(
                            (exercise, index2) => (
                              <Typography
                                color="black"
                                variant="subtitle2"
                                key={index2}
                              >
                                {getExerciseByID(exercise).name}
                              </Typography>
                            )
                          )}
                          <Button
                            color="primary"
                            variant="contained"
                            sx={{ textTransform: "none" }}
                            style={{
                              float: "right",
                              marginBottom: "10px",
                              width: "30%",
                            }}
                            onClick={() =>
                              selectAndStartWorkout(
                                getWorkoutByID(workout.workout_id)
                              )
                            }
                          >
                            <Typography color="black" variant="subtitle2">
                              select
                            </Typography>
                          </Button>
                        </AccordionDetails>
                      </Accordion>
                    </Box>
                    <br />
                  </div>
                ))}
            </div>
          ) : (
            <></>
          )}
        </Box>
        {/* recent activity */}
        <Box className="box">
          <Typography marginBottom="10px" textAlign="center" variant="h6">
            recent activity
          </Typography>

          {completedWorkouts && completedWorkouts.length > 0 ? (
            <WorkoutChart workouts={completedWorkouts} />
          ) : (
            <Typography variant="body1">No Workout Data</Typography>
          )}
        </Box>
      </Container>
      <br />
      <br />
      <br />
      <br />
      <FindWorkoutModal
        open={findWorkoutModalOpen}
        onCancel={() => setFindWorkoutModalOpen(false)}
        userWorkouts={userWorkouts}
        presetWorkouts={presetWorkouts}
        reloadWorkouts={getWorkouts}
        setSelectedWorkout={selectAndStartWorkout}
      />
      <CreateWorkoutModal
        open={createWorkoutModalOpen}
        onCancel={() => setCreateWorkoutModalOpen(false)}
        reloadExercises={getExercisesForUser}
        reloadWorkouts={getWorkouts}
        setSelectedWorkout={selectAndStartWorkout}
        userExercises={userExercises}
        presetExercises={presetExercises}
      />
      <WorkoutInProgressModal
        open={workoutInProgressModalOpen}
        onCancel={() => setWorkoutInProgressModalOpen(false)}
        workout={selectedWorkout}
        allExercises={allExercises}
        reloadCompletedWorkouts={getCompletedWorkouts}
      />
      <Dialog
        open={openShareCodeInputDialog}
        onClose={handleShareCodeInputDialogClose}
      >
        <DialogTitle>Enter Workout Share Code</DialogTitle>
        <DialogContent>
          <div style={{ textAlign: "center" }}>
            <TextField
              autoFocus
              margin="dense"
              id="sharecode"
              label="Sharecode"
              variant="standard"
              onChange={onShareCodeChange}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={handleShareCodeInputDialogClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={getWorkoutFromCode}
          >
            Import
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openNotASubscriberDialog}
        keepMounted
        onClose={handleNotASubscriberDialogClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Not a Subscriber!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Need to subscribe to create more than 5 custom workouts or delete an
            existing one!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNotASubscriberDialogClose}>Okay</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};
export default WorkoutComponent;
