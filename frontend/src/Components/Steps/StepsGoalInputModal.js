import React, { useState } from "react";

import { ThemeProvider } from "@mui/material/styles";
import {
  Button,
  Card,
  CardContent,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import theme from "../../theme";
import "../../App.css";

// props: open, onCancel, reloadUserGoals, goaluser
const StepsGoalInputModal = (props) => {
  const [goal, setGoal] = useState(0);

  const updateUser = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
      let query = JSON.stringify({
        query: `mutation{updateUser(_id: "${props.user._id}", username: "${props.user.username}", password: "${props.user.password}", first: "${props.user.firstName}", last: "${props.user.lastName}", stepsgoal: ${goal}) {_id}}`,
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

      //Reload the users so it includes the changes made
      props.reloadUserGoals();

      //Clear and Close the modal
      clearAndClose();
    } catch (error) {
      console.log(`Problem updating users - ${error.message}`);
    }
  };

  const clearAndClose = () => {
    setGoal(0);
    props.onCancel();
  };

  return (
    <ThemeProvider theme={theme}>
      <Modal
        open={props.open}
        className="centerAlign"
        style={{ marginLeft: "5%", marginRight: "5%" }}
      >
        <Card>
          <CardContent>
            <CloseIcon style={{ float: "right" }} onClick={clearAndClose} />

            <div className="textfield_main">
              <Typography variant="h6" textAlign="center">
                daily step goal
              </Typography>
              <br />
              <TextField
                label="Enter New Goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                variant="outlined"
                color="tertiary"
              />
              <br />
              <br />
            </div>
            <Button
              color="primary"
              onClick={updateUser}
              style={{
                display: "block",
                margin: "auto",
                textTransform: "none",
                width: "40%",
              }}
              variant="contained"
            >
              <Typography color="black" variant="subtitle1">
                update
              </Typography>
            </Button>
          </CardContent>
        </Card>
      </Modal>
    </ThemeProvider>
  );
};

export default StepsGoalInputModal;
