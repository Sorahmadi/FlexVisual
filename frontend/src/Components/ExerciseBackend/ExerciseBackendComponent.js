import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import theme from "../../theme";
import ExerciseEditModal from "./ExerciseEditModal";
import "../../App.css";

const ExerciseBackendComponent = () => {
  const [userExercises, setUserExercises] = useState([]);
  const [presetExercises, setPresetExercises] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);

  const [exerciseToEdit, setExerciseToEdit] = useState({});
  const [exerciseEditOpen, setExerciseEditOpen] = useState(false);

  //#region On Change Methods
  const onNameChange = function (e) {
    setName(e.target.value);
  };
  const onDescriptionChange = function (e) {
    setDescription(e.target.value);
  };
  const onMuscleGroupChange = function (e) {
    setMuscleGroup(e.target.value);
  };
  const onRepsChange = function (e) {
    setReps(e.target.value);
  };
  const onWeightChange = function (e) {
    setWeight(e.target.value);
  };
  //#endregion

  //On this page load, get the exercises
  useEffect(() => {
    getExercisesForUser();
  }, []);

  const editExercise = async (exercise) => {
    //Set the task to edit props
    setExerciseToEdit(exercise);
    //Open the modal
    setExerciseEditOpen(true);
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
    } catch (error) {
      console.log(`Problem getting exercises - ${error.message}`);
    }
  };

  //Add Exercise Query
  const addExercise = async () => {
    //Clear old data
    setName("");
    setDescription("");
    setMuscleGroup("");
    setReps(0);
    setWeight(0);

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
      let query = JSON.stringify({
        query: `mutation{addExercise(user_id: "${window.sessionStorage.getItem(
          "user_id"
        )}", type: "Custom", name: "${name}", description: "${description}", muscleGroup: "${muscleGroup}, reps: ${reps}, weight: ${weight}") {_id, type, name, description, muscleGroup, reps, weight}}`,
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
      getExercisesForUser();
    } catch (error) {
      console.log(`Problem adding exercise - ${error.message}`);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Adding Exercise */}
      <Card>
        <CardContent>
          <Typography
            variant="h6"
            color="primary"
            style={{ textAlign: "center" }}
          >
            Create a Exercise
          </Typography>
          <TextField label="Name" value={name} onChange={onNameChange} />
          <TextField
            label="Muscle Group"
            value={muscleGroup}
            onChange={onMuscleGroupChange}
          />
          <TextField
            label="Description"
            value={description}
            onChange={onDescriptionChange}
          />
          <TextField label="Reps" value={reps} onChange={onRepsChange} />
          <TextField label="Weight" value={weight} onChange={onWeightChange} />
          <br />
          <br />
          <div>
            <Button variant="contained" color="success" onClick={addExercise}>
              Create Exercise
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exercise List */}
      <Card>
        <CardContent>
          <Typography
            variant="h6"
            color="primary"
            style={{ textAlign: "center" }}
          >
            User Exercises
          </Typography>
          {userExercises != null && userExercises?.length !== 0 ? (
            userExercises.map((exercise, index) => (
              <Typography color="secondary" key={userExercises[index]._id}>
                {`${index + 1}. ${userExercises[index].name}`}
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => editExercise(exercise)}
                >
                  <EditIcon />
                </IconButton>
              </Typography>
            ))
          ) : (
            <Typography color="secondary" style={{ textAlign: "center" }}>
              No exercises made by this user
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography
            variant="h6"
            color="primary"
            style={{ textAlign: "center" }}
          >
            Preset Exercises
          </Typography>
          {presetExercises != null && presetExercises?.length !== 0 ? (
            presetExercises.map((exercise, index) => (
              <Typography color="secondary" key={presetExercises[index]._id}>
                {`${index + 1}. ${presetExercises[index].name}`}
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => editExercise(exercise)}
                >
                  <EditIcon />
                </IconButton>
              </Typography>
            ))
          ) : (
            <Typography color="secondary" style={{ textAlign: "center" }}>
              No preset Exercises
            </Typography>
          )}
        </CardContent>
      </Card>
      <ExerciseEditModal
        open={exerciseEditOpen}
        onCancel={() => setExerciseEditOpen(false)}
        exerciseToEdit={exerciseToEdit}
        reloadExercises={() => getExercisesForUser()}
      />
    </ThemeProvider>
  );
};
export default ExerciseBackendComponent;
