//#region Imports
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Button, Modal, Card, CardContent, TextField } from "@mui/material";
import theme from "../../theme";
import "../../App.css";
//#endregion

const ExerciseEditModal = (props) => {
  //#region State Variables
  //State variables for exercise input
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);

  //#endregion

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

  //On page load, get members from the props
  useEffect(() => {
    setName(props.exerciseToEdit.name);
    setDescription(props.exerciseToEdit.description);
    setMuscleGroup(props.exerciseToEdit.muscleGroup);
    setReps(props.exerciseToEdit.reps);
    setWeight(props.exerciseToEdit.weight);
  }, [props.exerciseToEdit]);

  //#region Database Queries
  const updateExercise = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
      let query = JSON.stringify({
        query: `mutation{updateExercise(_id: "${props.exerciseToEdit._id}", name: "${name}", description: "${description}", muscleGroup: "${muscleGroup}", reps: ${reps}, weight: ${weight}) {_id, name, description, muscleGroup, reps, weight}}`,
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

      //Reload the exercises so it includes the changes made
      props.reloadExercises();

      //Clear and Close the modal
      clearAndClose();
    } catch (error) {
      console.log(`Problem updating exercise - ${error.message}`);
    }
  };
  //#endregion

  const clearAndClose = async () => {
    //Clear the previous input data so it is empty
    //when the next exercise is added
    setName(props.exerciseToEdit.name);
    setDescription(props.exerciseToEdit.description);
    setMuscleGroup(props.exerciseToEdit.muscleGroup);
    setReps(props.exerciseToEdit.reps);
    setWeight(props.exerciseToEdit.weight);

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
            <TextField
              label="Weight"
              value={weight}
              onChange={onWeightChange}
            />
            <br />
            <br />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="contained"
                color="success"
                onClick={updateExercise}
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

export default ExerciseEditModal;
