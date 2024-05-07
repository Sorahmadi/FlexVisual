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
import theme from "../theme";
import UserEditModal from "./UserEditModal";
import "../App.css";

const UserComponent = () => {
  const [users, setUsers] = useState([]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [userToEdit, setUserToEdit] = useState({});
  const [userEditOpen, setUserEditOpen] = useState(false);

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

  //On this page load, get the users
  useEffect(() => {
    getUsers();
  }, []);

  const editUser = async (user) => {
    //Set the task to edit props
    setUserToEdit(user);
    //Open the modal
    setUserEditOpen(true);
  };

  //Get members query
  const getUsers = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let query = JSON.stringify({
        query: `query{getAllUsers{_id, username, password, first, last, stepsgoal}}`,
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

      //Set all users data to the result
      setUsers(json.data.getAllUsers);
      console.log(json.data.getAllUsers);
    } catch (error) {
      console.log(`Problem getting users - ${error.message}`);
    }
  };

  //Add User Query
  const addUser = async () => {
    //Clear old data
    setUsername("");
    setPassword("");
    setFirstName("");
    setLastName("");

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
      let query = JSON.stringify({
        query: `mutation{addUser(username: "${username}", password: "${password}", first: "${firstName}", last: "${lastName}", stepsgoal: 0) {first, last}}`,
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

      //Reget Users
      getUsers();
    } catch (error) {
      console.log(`Problem adding user - ${error.message}`);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Adding User */}
      <Card>
        <CardContent>
          <Typography
            variant="h6"
            color="primary"
            style={{ textAlign: "center" }}
          >
            Add a User
          </Typography>
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
          <div>
            <Button variant="contained" color="success" onClick={addUser}>
              Add User
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <Card>
        <CardContent>
          <Typography
            variant="h6"
            color="primary"
            style={{ textAlign: "center" }}
          >
            Current Users
          </Typography>
          {users != null && users?.length !== 0 ? (
            users.map((user, index) => (
              <Typography color="secondary" key={user.last}>
                {`${index + 1}. ${user.first} ${user.last}`}
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => editUser(user)}
                >
                  <EditIcon />
                </IconButton>
              </Typography>
            ))
          ) : (
            <Typography color="secondary" style={{ textAlign: "center" }}>
              There are currently no users in the database
            </Typography>
          )}
        </CardContent>
      </Card>
      <UserEditModal
        open={userEditOpen}
        onCancel={() => setUserEditOpen(false)}
        userToEdit={userToEdit}
        reloadUsers={() => getUsers()}
      />
    </ThemeProvider>
  );
};
export default UserComponent;
