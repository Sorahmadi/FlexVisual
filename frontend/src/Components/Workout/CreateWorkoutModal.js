//#region Imports
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Button,
  Modal,
  Card,
  CardContent,
  Typography,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import theme from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import ExpandMore from "@mui/icons-material/ExpandMore";
import "../../App.css";
//#endregion

const FindWorkoutModal = (props) => {
  //#region State Variables
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [exerciseName, setExerciseName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [exercisedescription, setExerciseDescription] = useState("");
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);

  const [selectedUserExercises, setSelectedUserExercises] = useState([]);
  const [selectedPresetExercises, setSelectedPresetExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);

  const [addExerciseDialogOpen, setAddExerciseDialogOpen] = useState(false);
  //#endregion

  //#region On Change Methods
  const onNameChange = function (e) {
    setName(e.target.value);
  };
  const onDescriptionChange = function (e) {
    setDescription(e.target.value);
  };

  const onExerciseNameChange = function (e) {
    setExerciseName(e.target.value);
  };
  const onMuscleGroupChange = function (e) {
    setMuscleGroup(e.target.value);
  };
  const onExerciseDescriptionChange = function (e) {
    setExerciseDescription(e.target.value);
  };
  const onRepsChange = function (e) {
    setReps(e.target.value);
  };
  const onWeightChange = function (e) {
    setWeight(e.target.value);
  };

  const userSelectionChanged = (e) => {
    setSelectedUserExercises(e);
    setSelectedExercises(e.concat(selectedPresetExercises));
  };
  const presetSelectionChanged = (e) => {
    setSelectedPresetExercises(e);
    setSelectedExercises(e.concat(selectedUserExercises));
  };

  const handleAddExerciseDialogClose = () => {
    setExerciseName("");
    setMuscleGroup("");
    setExerciseDescription("");
    setReps(0);
    setWeight(0);
    setAddExerciseDialogOpen(false);
  };

  //#endregion

  const clearAndClose = () => {
    setSelectedPresetExercises([]);
    setSelectedUserExercises([]);
    setSelectedExercises([]);
    setName("");
    setDescription("");

    props.onCancel();
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
    {
      field: "muscleGroup",
      headerName: "Muscle Group",
      width: 140,
    },
    {
      field: "reps",
      headerName: "Reps",
      width: 50,
    },
    {
      field: "weight",
      headerName: "Weight",
      width: 80,
    },
  ];

  //#region database queries

  //Add Workout Query
  const addWorkout = async (selectAfterAdd) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
      let query = JSON.stringify({
        query: `mutation{addWorkout(user_id: "${window.sessionStorage.getItem(
          "user_id"
        )}", subscribers: ${JSON.stringify(
          []
        )}, type: "Custom", name: "${name}", description: "${description}", exercises: ${JSON.stringify(
          selectedExercises
        )}) {_id, subscribers, type, name, description, exercises}}`,
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

      //IF the user wants to start after create, set as the selected workout
      if (selectAfterAdd) {
        props.setSelectedWorkout(json.data.addWorkout);
      }

      //Reset Workouts
      props.reloadWorkouts();

      clearAndClose();
    } catch (error) {
      console.log(`Problem adding workout - ${error.message}`);
    }
  };

  //Add Exercise Query
  const addExercise = async () => {
    handleAddExerciseDialogClose();

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
      let query = JSON.stringify({
        query: `mutation{addExercise(user_id: "${window.sessionStorage.getItem(
          "user_id"
        )}", type: "Custom", name: "${exerciseName}", description: "${exercisedescription}", muscleGroup: "${muscleGroup}", reps: ${reps}, weight: ${weight}) {_id, type, name, description, muscleGroup, reps, weight}}`,
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

      //Reset Exercises
      props.reloadExercises();
    } catch (error) {
      console.log(`Problem adding exercise - ${error.message}`);
    }
  };
  //#endregion

  return (
    //#region JSX
    <ThemeProvider theme={theme}>
      <Modal open={props.open} className="centerAlign">
        <Card style={{ width: "100%", height: "100%", overflow: "auto" }}>
          <CardContent>
            <Typography
              variant="h5"
              color="primary"
              style={{ textAlign: "center" }}
            >
              create a workout
            </Typography>
            <br />
            <Typography
              variant="h6"
              color="black"
              style={{ textAlign: "center" }}
            >
              details
            </Typography>
            <div style={{ textAlign: "center" }}>
              <TextField
                label="workout name"
                value={name}
                onChange={onNameChange}
              />
              <br />
              <br />
              <TextField
                label="description"
                value={description}
                onChange={onDescriptionChange}
              />
            </div>
            <br />
            <br />
            <Typography
              variant="h6"
              color="black"
              style={{ textAlign: "center" }}
            >
              exercises
            </Typography>
            <br />
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography
                  variant="h6"
                  color="primary"
                  style={{ textAlign: "center" }}
                >
                  User Exercises
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <DataGrid
                  autoHeight={true}
                  getRowId={(row) => row._id}
                  rows={props.userExercises}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  checkboxSelection
                  disableSelectionOnClick
                  onSelectionModelChange={(e) => {
                    userSelectionChanged(e);
                  }}
                />
                <div style={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ textTransform: "none", margin: "4px" }}
                    onClick={() => setAddExerciseDialogOpen(true)}
                  >
                    new exercise
                  </Button>
                </div>
              </AccordionDetails>
            </Accordion>
            <br />
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography
                  variant="h6"
                  color="primary"
                  style={{ textAlign: "center" }}
                >
                  Preset Exercises
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <DataGrid
                  autoHeight={true}
                  getRowId={(row) => row._id}
                  rows={props.presetExercises}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  checkboxSelection
                  disableSelectionOnClick
                  onSelectionModelChange={(e) => {
                    presetSelectionChanged(e);
                  }}
                />
              </AccordionDetails>
            </Accordion>

            <br />
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <Button
                variant="contained"
                color="error"
                style={{ width: "25%", textTransform: "none" }}
                onClick={clearAndClose}
              >
                cancel
              </Button>
              <Button
                variant="contained"
                color="secondary"
                style={{ width: "35%", textTransform: "none" }}
                onClick={() => addWorkout(true)}
              >
                create & start
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ width: "25%", textTransform: "none" }}
                onClick={() => addWorkout(false)}
              >
                create
              </Button>
            </div>
          </CardContent>
        </Card>
      </Modal>
      <Dialog
        open={addExerciseDialogOpen}
        onClose={handleAddExerciseDialogClose}
      >
        <DialogTitle>new exercise</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={exerciseName}
            onChange={onExerciseNameChange}
          />
          <br />
          <br />
          <TextField
            label="Muscle Group"
            value={muscleGroup}
            onChange={onMuscleGroupChange}
          />
          <br />
          <br />
          <TextField
            label="Description"
            value={exercisedescription}
            onChange={onExerciseDescriptionChange}
          />
          <br />
          <br />
          <TextField label="Reps" value={reps} onChange={onRepsChange} />
          <br />
          <br />
          <TextField label="Weight" value={weight} onChange={onWeightChange} />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={handleAddExerciseDialogClose}
            style={{ textTransform: "none" }}
          >
            cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ textTransform: "none" }}
            onClick={addExercise}
          >
            add
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
    //#endregion
  );
};

export default FindWorkoutModal;
