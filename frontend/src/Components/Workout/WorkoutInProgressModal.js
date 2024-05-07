//#region Imports
import React, { useEffect, useState, createRef } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Button,
  Modal,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import theme from "../../theme";
import logo from "../../images/image.png";
import ExpandMore from "@mui/icons-material/ExpandMore";
import * as htmlToImage from "html-to-image";
import "../../App.css";
//#endregion

const WorkoutInProgressModal = (props) => {
  //#region State Variables
  const [allExercisesComplete, setAllExercisesComplete] = useState(false);
  const [exercisesToComplete, setExercisesToComplete] = useState([]);
  const [completedExercises, setCompletedExercises] = useState([]);

  const [openResultsDialog, setOpenResultsDialog] = React.useState(false);
  //#endregion
  const getExerciseByID = (id) => {
    return props.allExercises.find((exercise) => {
      return exercise._id === id;
    });
  };

  useEffect(() => {
    setExercisesToComplete(props.workout.exercises);
    setCompletedExercises([]);
    getUserByID();
  }, [props.workout.exercises]);

  const completeExercise = (exerciseID) => {
    let newToComplete = [...exercisesToComplete];
    let index = newToComplete.indexOf(exerciseID);
    newToComplete.splice(index, 1);
    setExercisesToComplete(newToComplete);

    let newCompleted = [...completedExercises];
    newCompleted.push(exerciseID);
    setCompletedExercises(newCompleted);

    if (newToComplete.length === 0) {
      setAllExercisesComplete(true);
    }
  };

  const handleResultsDialogClose = () => {
    setOpenResultsDialog(false);
    clearAndClose();
  };

  const completeWorkout = () => {
    addCompletedWorkout();
  };

  const clearAndClose = () => {
    setExercisesToComplete([]);
    setCompletedExercises([]);
    setAllExercisesComplete(false);

    props.onCancel();
  };

  //#region Database queries

  //Add completed workout query
  const addCompletedWorkout = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
      let query = JSON.stringify({
        query: `mutation{addCompletedWorkout(user_id: "${window.sessionStorage.getItem(
          "user_id"
        )}", workout_id: "${
          props.workout._id
        }", datecompleted: "${new Date()}") {_id, user_id, workout_id, datecompleted}}`,
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
      props.reloadCompletedWorkouts();

      //Open the results Dialog
      setOpenResultsDialog(true);
    } catch (error) {
      console.log(`Problem adding completed workout - ${error.message}`);
    }
  };

  //#endregion

  const ref = createRef(null);
  const takeScreenShot = async (node) => {
    const dataURI = await htmlToImage.toJpeg(node);
    return dataURI;
  };
  const download = (image, { name = "img", extension = "jpg" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };
  const createFileName = (extension = "", ...names) => {
    if (!extension) {
      return "";
    }
  
    return `${names.join("")}.${extension}`;
  };
  function shareWorkout() {
    if(isSubscribed) {
      takeScreenShot(ref.current).then(download);
    }
  }

  const [isSubscribed, setIsSubscribed] = useState(false);

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

  return (
    //#region JSX
    <ThemeProvider theme={theme}>
      <Modal open={props.open} className="centerAlign">
        <Card style={{ width: "100%", height: "100%", overflow: "auto" }}>
          <CardContent>
            <Typography
              variant="h5"
              color="black"
              style={{ textAlign: "center" }}
            >
              {props.workout.name}
            </Typography>
            <br />
            <br />

            {exercisesToComplete !== undefined &&
              exercisesToComplete.length !== 0 && (
                <Typography
                  variant="h6"
                  color="black"
                  style={{ textAlign: "center" }}
                >
                  exercises to complete
                </Typography>
              )}
            {exercisesToComplete !== undefined &&
              exercisesToComplete.map((exerciseID) => (
                <div key={exerciseID}>
                  <Accordion sx={{ bgcolor: "secondary.main" }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography
                        variant="subtitle1"
                        color="black"
                        style={{ textAlign: "center" }}
                      >
                        {getExerciseByID(exerciseID).name}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="subtitle1" color="black">
                        Reps: {getExerciseByID(exerciseID).reps}
                      </Typography>
                      {getExerciseByID(exerciseID).weight > 0 && (
                        <Typography variant="subtitle1" color="black">
                          Weight: {getExerciseByID(exerciseID).weight}
                        </Typography>
                      )}
                      <Typography variant="subtitle1" color="black">
                        Description: {getExerciseByID(exerciseID).description}
                      </Typography>

                      <div style={{ textAlign: "center" }}>
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ textTransform: "none" }}
                          onClick={() => completeExercise(exerciseID)}
                        >
                          complete exercise
                        </Button>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                  <br />
                </div>
              ))}

            {completedExercises.length !== 0 && (
              <Typography
                variant="h6"
                color="black"
                style={{ textAlign: "center" }}
              >
                completed exercises
              </Typography>
            )}
            {completedExercises !== undefined &&
              completedExercises.map((exerciseID) => (
                <div key={exerciseID}>
                  <Accordion sx={{ bgcolor: "primary.main" }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography
                        variant="subtitle1"
                        color="black"
                        style={{ textAlign: "center" }}
                      >
                        {getExerciseByID(exerciseID).name}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="subtitle1" color="black">
                        Reps: {getExerciseByID(exerciseID).reps}
                      </Typography>
                      {getExerciseByID(exerciseID).weight > 0 && (
                        <Typography variant="subtitle1" color="black">
                          Weight: {getExerciseByID(exerciseID).weight}
                        </Typography>
                      )}
                      <Typography variant="subtitle1" color="black">
                        Description: {getExerciseByID(exerciseID).description}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  <br />
                </div>
              ))}

            <br />
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <Button
                variant="contained"
                color="error"
                style={{ width: "40%", textTransform: "none" }}
                onClick={clearAndClose}
              >
                cancel workout
              </Button>
              <Button
                variant="contained"
                disabled={!allExercisesComplete}
                color="primary"
                style={{ width: "40%", textTransform: "none" }}
                onClick={completeWorkout}
              >
                finish workout
              </Button>
            </div>
          </CardContent>
        </Card>
      </Modal>
      <Dialog ref={ref} open={openResultsDialog} onClose={handleResultsDialogClose}>
        <DialogTitle>Workout Complete</DialogTitle>
        <DialogContent>
          <Card>
            <CardContent>
              <Typography
                variant="subtitle1"
                color="primary"
                style={{ textAlign: "center" }}
              >
                Here is your workout summary:
              </Typography>
              <div>
                {props.workout.exercises !== undefined &&
                  props.workout.exercises.map((exerciseID) => (
                    <Typography
                      variant="subtitle1"
                      color="black"
                      key={exerciseID}
                    >
                      {getExerciseByID(exerciseID)
                        .reps.toString()
                        .padEnd(3, " ")}
                      {"x "}
                      {getExerciseByID(exerciseID)
                        .weight.toString()
                        .padEnd(4, " ")}
                      lbs |{" "}
                      <span style={{ fontSize: 14 }}>
                        {getExerciseByID(exerciseID).name}
                      </span>
                    </Typography>
                  ))}
              </div>
            </CardContent>
          </Card>
          <div style={{ textAlign: "center" }}>
            <img
              src={logo}
              alt="Logo"
              height="7%"
              width="20%"
              style={{
                position: "relative",
                top: "20px",
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          {isSubscribed &&
            <Button variant="contained" color="secondary" onClick={shareWorkout}>
              Share
            </Button>
          }
          <Button
            variant="contained"
            color="primary"
            onClick={handleResultsDialogClose}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
    //#endregion
  );
};

export default WorkoutInProgressModal;
