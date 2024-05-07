import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import IosShareIcon from "@mui/icons-material/IosShare";
import theme from "../../theme";
import WorkoutEditModal from "./WorkoutEditModal";
import "../../App.css";

const WorkoutBackendComponent = () => {
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [presetWorkouts, setPresetWorkouts] = useState([]);

  const [userExercises, setUserExercises] = useState([]);
  const [presetExercises, setPresetExercises] = useState([]);
  const [allExercises, setAllExercises] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [workoutToEdit, setWorkoutToEdit] = useState({});
  const [workoutEditOpen, setWorkoutEditOpen] = useState(false);

  const [selectedUserExercises, setSelectedUserExercises] = useState([]);
  const [selectedPresetExercises, setSelectedPresetExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);

  const [sharecode, setSharecode] = useState("");
  const [open, setOpen] = React.useState(false);

  //#region On Change Methods
  const onNameChange = function (e) {
    setName(e.target.value);
  };
  const onDescriptionChange = function (e) {
    setDescription(e.target.value);
  };
  const onShareCodeChange = function (e) {
    setSharecode(e.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const userSelectionChanged = (e) => {
    setSelectedUserExercises(e);
    setSelectedExercises(e.concat(selectedPresetExercises));
  };
  const presetSelectionChanged = (e) => {
    setSelectedPresetExercises(e);
    setSelectedExercises(e.concat(selectedUserExercises));
  };
  //#endregion

  //On this page load, get the workouts
  useEffect(() => {
    getWorkouts();
    getExercisesForUser();
  }, []);

  const editWorkout = async (workout) => {
    //Set the task to edit props
    setWorkoutToEdit(workout);
    //Open the modal
    setWorkoutEditOpen(true);
  };

  function makeID(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const shareWorkout = async (workout) => {
    //Check if there is already a share code
    if (workout.sharecode == null) {
      addShareCode(workout, makeID(6));
    }
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
      width: 100,
    },
    {
      field: "description",
      headerName: "Description",
      width: 120,
    },
    {
      field: "reps",
      headerName: "Reps",
      type: "number",
      width: 60,
    },
    {
      field: "weight",
      headerName: "Weight",
      type: "number",
      width: 70,
    },
  ];

  //Get workouts for user query
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
    } catch (error) {
      console.log(`Problem getting workouts - ${error.message}`);
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

  //Add Workout Query
  const addWorkout = async () => {
    //Clear old data
    setName("");
    setDescription("");

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
      await response.json();

      //Reset Workouts
      getWorkouts();
    } catch (error) {
      console.log(`Problem adding workout - ${error.message}`);
    }
  };

  //Add workout from Code Query
  const getWorkoutFromCode = async () => {
    //Close modal
    handleClose();

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
      let query = JSON.stringify({
        query: `query{getWorkoutByShareCode(sharecode: "${sharecode}"){_id, createdby, subscribers, type, name, description, exercises, sharecode}}`,
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

  //Add Workout Query
  const addShareCode = async (workout, sharecode) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
      let query = JSON.stringify({
        query: `mutation{addShareCode(_id: "${workout._id}", sharecode: "${sharecode}") {_id, subscribers, type, name, description, exercises, sharecode}}`,
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

  return (
    <ThemeProvider theme={theme}>
      {/* Adding Workout */}
      <Card>
        <CardContent>
          <Typography
            variant="h6"
            color="primary"
            style={{ textAlign: "center" }}
          >
            Create a Workout
          </Typography>
          <TextField label="Name" value={name} onChange={onNameChange} />
          <TextField
            label="Description"
            value={description}
            onChange={onDescriptionChange}
          />
          <Typography
            variant="h6"
            color="primary"
            style={{ textAlign: "center" }}
          >
            User Exercises
          </Typography>
          <Box sx={{ height: 300, width: "100%" }}>
            <DataGrid
              getRowId={(row) => row._id}
              rows={userExercises}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              disableSelectionOnClick
              onSelectionModelChange={(e) => {
                userSelectionChanged(e);
              }}
            />
          </Box>
          <Typography
            variant="h6"
            color="primary"
            style={{ textAlign: "center" }}
          >
            Preset Exercises
          </Typography>
          <Box sx={{ height: 300, width: "100%" }}>
            <DataGrid
              getRowId={(row) => row._id}
              rows={presetExercises}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              disableSelectionOnClick
              onSelectionModelChange={(e) => {
                presetSelectionChanged(e);
              }}
            />
          </Box>
          <br />
          <br />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained" color="success" onClick={addWorkout}>
              Create Workout
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleClickOpen}
            >
              Import Workout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Workout List */}
      <Card>
        <CardContent>
          <Typography
            variant="h6"
            color="primary"
            style={{ textAlign: "center" }}
          >
            Current Workouts For User
          </Typography>
          {userWorkouts != null && userWorkouts?.length !== 0 ? (
            userWorkouts.map((workout, index) => (
              <Typography color="secondary" key={userWorkouts[index]._id}>
                {`${index + 1}. ${userWorkouts[index].name}`}
                <IconButton edge="end" onClick={() => editWorkout(workout)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => shareWorkout(workout)}>
                  <IosShareIcon />
                </IconButton>
                {workout.sharecode !== null ? (
                  <span>{workout.sharecode}</span>
                ) : (
                  <span></span>
                )}
              </Typography>
            ))
          ) : (
            <Typography color="secondary" style={{ textAlign: "center" }}>
              No user made workouts
            </Typography>
          )}
          <br />

          <Typography
            variant="h6"
            color="primary"
            style={{ textAlign: "center" }}
          >
            Preset Workouts
          </Typography>
          {presetWorkouts != null && presetWorkouts?.length !== 0 ? (
            presetWorkouts.map((workout, index) => (
              <Typography color="secondary" key={presetWorkouts[index]._id}>
                {`${index + 1}. ${presetWorkouts[index].name}`}
                <IconButton edge="end" onClick={() => editWorkout(workout)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => shareWorkout(workout)}>
                  <IosShareIcon />
                </IconButton>
                {workout.sharecode !== null ? (
                  <span>{workout.sharecode}</span>
                ) : (
                  <span></span>
                )}
              </Typography>
            ))
          ) : (
            <Typography color="secondary" style={{ textAlign: "center" }}>
              No preset Workouts
            </Typography>
          )}
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Enter Workout Share Code</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="sharecode"
            label="Sharecode"
            fullWidth
            variant="standard"
            onChange={onShareCodeChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={getWorkoutFromCode}>Import</Button>
        </DialogActions>
      </Dialog>
      <WorkoutEditModal
        open={workoutEditOpen}
        onCancel={() => setWorkoutEditOpen(false)}
        workoutToEdit={workoutToEdit}
        userExercises={allExercises}
        reloadWorkouts={() => getWorkouts()}
      />
    </ThemeProvider>
  );
};
export default WorkoutBackendComponent;
