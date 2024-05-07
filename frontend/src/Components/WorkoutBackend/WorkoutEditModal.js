//#region Imports
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Button,
  Modal,
  Card,
  CardContent,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import theme from "../../theme";
import "../../App.css";
//#endregion

const WorkoutEditModal = (props) => {
  //#region State Variables
  //State variables for workout input
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subscribers, setSubscribers] = useState([]);
  const [exercises, setExercises] = useState([]);

  //#endregion

  //#region On Change Methods
  const onNameChange = function (e) {
    setName(e.target.value);
  };
  const onDescriptionChange = function (e) {
    setDescription(e.target.value);
  };
  //#endregion

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
    {
      field: "muscleGroup",
      headerName: "Muscle Group",
      width: 110,
    },
    {
      field: "description",
      headerName: "Descriptioname",
      width: 150,
    },
    {
      field: "reps",
      headerName: "Reps",
      type: "number",
      width: 110,
    },
    {
      field: "weight",
      headerName: "Weight",
      type: "number",
      width: 110,
    },
  ];

  //On page load, get members from the props
  useEffect(() => {
    setName(props.workoutToEdit.name);
    setDescription(props.workoutToEdit.description);
    setSubscribers(props.workoutToEdit.subscribers);
    setExercises(props.workoutToEdit.exercises);
  }, [props.workoutToEdit]);

  //#region Database Queries
  const updateWorkout = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
      let query = JSON.stringify({
        query: `mutation{updateWorkout(_id: "${
          props.workoutToEdit._id
        }",  subscribers: ${JSON.stringify(
          subscribers
        )}, name: "${name}", description: "${description}", exercises: ${JSON.stringify(
          exercises
        )}) {_id, subscribers, name, description, exercises}}`,
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

      //Reload the workouts so it includes the changes made
      props.reloadWorkouts();

      //Clear and Close the modal
      clearAndClose();
    } catch (error) {
      console.log(`Problem updating workout - ${error.message}`);
    }
  };
  //#endregion

  const clearAndClose = async () => {
    setName(props.workoutToEdit.name);
    setDescription(props.workoutToEdit.description);
    setSubscribers(props.workoutToEdit.subscribers);
    setExercises(props.workoutToEdit.exercises);

    //Close the modal
    props.onCancel();
  };

  return (
    //#region JSX
    <ThemeProvider theme={theme}>
      <Modal open={props.open} className="centerAlign">
        <Card>
          <CardContent>
            <TextField label="Name" value={name} onChange={onNameChange} />
            <TextField
              label="Description"
              value={description}
              onChange={onDescriptionChange}
            />
            <Box sx={{ height: 200, width: "100%" }}>
              <DataGrid
                getRowId={(row) => row._id}
                rows={props.userExercises}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
                onSelectionModelChange={(e) => {
                  setExercises(e);
                }}
                selectionModel={exercises}
              />
            </Box>
            <br />
            <br />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="contained"
                color="success"
                onClick={updateWorkout}
              >
                Save
              </Button>
              <Button variant="contained" color="error" onClick={clearAndClose}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </Modal>
    </ThemeProvider>
    //#endregion
  );
};

export default WorkoutEditModal;
