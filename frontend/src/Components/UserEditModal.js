//#region Imports
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Button, Modal, Card, CardContent, TextField } from "@mui/material";
import theme from "../theme";
import "../App.css";
//#endregion

const UserEditModal = (props) => {
  //#region State Variables
  //State variables for user input
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  //#endregion

  //#region On Change Methods
  const onFirstNameChange = function (e) {
    setFirstName(e.target.value);
  };
  const onLastNameChange = function (e) {
    setLastName(e.target.value);
  };
  const onUsernameChange = function (e) {
    setUsername(e.target.value);
  };
  const onPasswordChange = function (e) {
    setPassword(e.target.value);
  };
  //#endregion

  //On page load, get members from the props
  useEffect(() => {
    console.log(props.userToEdit);
    setUsername(props.userToEdit.username);
    setPassword(props.userToEdit.password);
    setFirstName(props.userToEdit.first);
    setLastName(props.userToEdit.last);
  }, [props.userToEdit]);

  //#region Database Queries
  const updateUser = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
      let query = JSON.stringify({
        query: `mutation{updateUser(_id: "${
          props.userToEdit._id
        }", username: "${username}", password: "${password}", first: "${firstName}", last: "${lastName}", stepsgoal: ${
          props.userToEdit.stepsgoal || 0
        }) {_id, first, last}}`,
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
      props.reloadUsers();

      //Clear and Close the modal
      clearAndClose();
    } catch (error) {
      console.log(`Problem updating users - ${error.message}`);
    }
  };
  //#endregion

  const clearAndClose = async () => {
    //Clear the previous input data so it is empty
    //when the next user is added
    setUsername("");
    setPassword("");
    setFirstName("");
    setLastName("");

    //Close the modal
    props.onCancel();
  };

  return (
    //#region JSX
    <ThemeProvider theme={theme}>
      <Modal open={props.open} className="centerAlign">
        <Card>
          <CardContent>
            <TextField
              label="Username"
              value={username}
              onChange={onUsernameChange}
            />
            <TextField
              label="Password"
              value={password}
              onChange={onPasswordChange}
            />
            <TextField
              label="First Name"
              value={firstName}
              onChange={onFirstNameChange}
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={onLastNameChange}
            />
            <br />
            <br />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="contained" color="success" onClick={updateUser}>
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

export default UserEditModal;
