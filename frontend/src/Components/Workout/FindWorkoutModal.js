//#region Imports
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Button,
  Modal,
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import theme from "../../theme";
import ClearIcon from "@mui/icons-material/Clear";
import IosShareIcon from "@mui/icons-material/IosShare";
import "../../App.css";
//#endregion

const FindWorkoutModal = (props) => {
  //#region State Variables
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] =
    React.useState(false);
  const [shareCodeDialogOpen, setShareCodeDialogOpen] = React.useState(false);
  const [shareCodeToDisplay, setShareCodeToDisplay] = React.useState("");
  const [workoutBeingShared, setWorkoutBeingShared] = React.useState({});

  const [workoutToDelete, setWorkoutToDelete] = useState({});
  //#endregion

  const handleConfirmDeleteDialogClose = () => {
    setConfirmDeleteDialogOpen(false);
  };
  const handleShareCodeDialogClose = () => {
    setShareCodeToDisplay("");
    setWorkoutBeingShared({});
    setShareCodeDialogOpen(false);
  };

  const selectAndClose = async (workout) => {
    //select the workout
    props.setSelectedWorkout(workout);

    //Close the modal
    props.onCancel();
  };

  const shareWorkout = async (workout) => {
    //Check if there is already a share code
    if (workout.sharecode == null) {
      addShareCode(workout, makeID(6));
    } else {
      setShareCodeToDisplay(workout.sharecode);
      setWorkoutBeingShared(workout);
      setShareCodeDialogOpen(true);
    }
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

  //Add Sharecode Query
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

      setShareCodeToDisplay(sharecode);
      setWorkoutBeingShared(workout);
      setShareCodeDialogOpen(true);

      //Reset Workouts
      props.reloadWorkouts();
    } catch (error) {
      console.log(`Problem adding workout - ${error.message}`);
    }
  };

  //#region Database queries

  //Delete workout query
  const deleteWorkout = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let query = JSON.stringify({
        query: `mutation 
        {
          deleteWorkoutByID(
            _id: "${workoutToDelete._id}"){_id}
        }`,
      });
      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });
      await response.json();
    } catch (error) {
      console.log(`Problem deleting workout - ${error.message}`);
    }

    setWorkoutToDelete({});

    //Reload Workouts
    props.reloadWorkouts();
    handleConfirmDeleteDialogClose();
  };
  //#endregion

  return (
    //#region JSX
    <ThemeProvider theme={theme}>
      <Modal open={props.open} className="centerAlign">
        <Card>
          <CardContent>
            <Typography
              variant="h5"
              color="primary"
              style={{ textAlign: "center" }}
            >
              select a workout
            </Typography>
            <br />
            {props.userWorkouts.length > 0 && (
              <div>
                <Typography
                  variant="h6"
                  color="black"
                  style={{ textAlign: "center" }}
                >
                  your workouts
                </Typography>
                <div style={{ width: 300, margin: "auto" }}>
                  <List style={{ maxHeight: "300px", overflow: "auto" }}>
                    {props.userWorkouts.map((workout, index) => (
                      <ListItem key={index}>
                        <Box
                          bgcolor="primary.main"
                          style={{ width: 250 }}
                          sx={{
                            borderTopLeftRadius: "8px",
                            borderBottomLeftRadius: "8px",
                          }}
                        >
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => selectAndClose(workout)}
                          >
                            <ListItemText
                              primary={workout.name}
                              style={{ textAlign: "center" }}
                            />
                          </ListItemButton>
                        </Box>
                        <Box
                          bgcolor="primary.main"
                          style={{ width: 110, height: 48 }}
                          sx={{
                            borderTopRightRadius: "8px",
                            borderBottomRightRadius: "8px",
                          }}
                        >
                          <IconButton onClick={() => shareWorkout(workout)}>
                            <IosShareIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setWorkoutToDelete(workout);
                              setConfirmDeleteDialogOpen(true);
                            }}
                          >
                            <ClearIcon />
                          </IconButton>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </div>
                <br />
              </div>
            )}
            <Typography
              variant="h6"
              color="black"
              style={{ textAlign: "center" }}
            >
              premade workouts
            </Typography>
            <div style={{ width: 300, margin: "auto" }}>
              <List>
                {props.presetWorkouts.map((workout, index) => (
                  <ListItem key={index}>
                    <Box
                      bgcolor="primary.main"
                      style={{ width: 300 }}
                      sx={{ borderRadius: "8px" }}
                    >
                      <ListItemButton
                        sx={{ pl: 4 }}
                        onClick={() => selectAndClose(workout)}
                      >
                        <ListItemText
                          primary={workout.name}
                          style={{ textAlign: "center" }}
                        />
                      </ListItemButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </div>

            <div style={{ textAlign: "center" }}>
              <Button
                color="error"
                variant="contained"
                sx={{ width: 300 }}
                onClick={props.onCancel}
              >
                cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </Modal>
      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDeleteDialogOpen}
        onClose={handleConfirmDeleteDialogClose}
      >
        <DialogTitle>Are you sure you want to delete this workout?</DialogTitle>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            onClick={handleConfirmDeleteDialogClose}
          >
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={deleteWorkout}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Code Dialog */}
      <Dialog open={shareCodeDialogOpen} onClose={handleShareCodeDialogClose}>
        <DialogTitle style={{ textAlign: "center" }}>
          Here is your sharecode for your workout: {workoutBeingShared.name}
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="h5"
            color="secondary"
            style={{ textAlign: "center" }}
          >
            {shareCodeToDisplay}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleShareCodeDialogClose}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
    //#endregion
  );
};

export default FindWorkoutModal;
