import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import StripeContainer from "./StripeContainer";
import theme from "../theme";
import logo from "../images/profilepic.jpg";
import "../App.css";

const UserProfileComponent = (props) => {
  const [user, setUser] = useState({});

  const [isSubscribed, setIsSubscribed] = useState(false);

  const [showUnsubscribe, setShowUnsubscribe] = useState(false);

  const [firstnameSub, setFirstnameSub] = useState("");
  const [lastnameSub, setLastnameSub] = useState("");
  const [addressSub, setAddressSub] = useState("");
  const [emailSub, setEmailSub] = useState("");
  const [amountSub, setAmountSub] = useState(10.0);

  useEffect(() => {
    getUserByID();
  }, []);

  const onFirstnameChange = function (e) {
    setFirstnameSub(e.target.value);
  };

  const onLastnameChange = function (e) {
    setLastnameSub(e.target.value);
  };

  const onAddressChange = function (e) {
    setAddressSub(e.target.value);
  };

  const onEmailChange = function (e) {
    setEmailSub(e.target.value);
  };

  const handleUnsubscribe = function () {
    setShowUnsubscribe(true);
  };

  const handleCloseUnsubscribe = () => {
    setShowUnsubscribe(false);
  };

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
      setUser(json.data.getUserByID);
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
        setFirstnameSub(json.data.getSubscribers[0].firstname);
        setLastnameSub(json.data.getSubscribers[0].lastname);
        setAddressSub(json.data.getSubscribers[0].address);
        setEmailSub(json.data.getSubscribers[0].email);
        setIsSubscribed(true);
      }
    } catch (error) {
      console.log(
        `Problem getting the subscriber by username - ${error.message}`
      );
    }
  };

  const deleteSubscription = async () => {
    setFirstnameSub("");
    setLastnameSub("");
    setAddressSub("");
    setEmailSub("");
    setIsSubscribed(false);

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let query = JSON.stringify({
        query: `mutation 
        {
          deleteSubscription(
            username: "${user.username}"){username}
        }`,
      });
      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });

      handleCloseUnsubscribe();
      await response.json();
    } catch (error) {
      console.log(`Problem deleting sub - ${error.message}`);
    }
  };

  const addSubscription = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
      let query = JSON.stringify({
        query: `mutation
        {
            addSubscription(
                firstname: "${firstnameSub}", 
                lastname:"${lastnameSub}", 
                address:"${addressSub}", 
                email:"${emailSub}", 
                username: "${user.username}", 
                amount:${amountSub})
            {firstname,lastname,address,email,username,amount}
        }`,
      });

      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });

      //send query
      await response.json();
      getSubscription(user);
    } catch (error) {
      console.log(`Problem adding user - ${error.message}`);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="box">
        <Typography variant="h5" style={{ textAlign: "center" }}>
          profile
        </Typography>
      </Box>

      <div className="centerAlign box">
        <img src={logo} alt="user" className="profilepic" />
      </div>

      <Typography variant="h5" color="primary" style={{ textAlign: "center" }}>
        {user.username}
      </Typography>
      <br />

      <TextField
        label="Firstname"
        value={firstnameSub}
        variant="outlined"
        color="tertiary"
        style={{
          textAlign: "center",
          width: "80%",
          display: "flex",
          margin: "auto",
        }}
        onChange={onFirstnameChange}
        disabled={isSubscribed}
      />
      <br />
      <TextField
        label="Lastname"
        value={lastnameSub}
        variant="outlined"
        color="tertiary"
        style={{
          textAlign: "center",
          width: "80%",
          display: "flex",
          margin: "auto",
        }}
        onChange={onLastnameChange}
        disabled={isSubscribed}
      />
      <br />
      <TextField
        label="Address"
        value={addressSub}
        variant="outlined"
        color="tertiary"
        style={{
          textAlign: "center",
          width: "80%",
          display: "flex",
          margin: "auto",
        }}
        onChange={onAddressChange}
        disabled={isSubscribed}
      />
      <br />
      <TextField
        label="Email"
        value={emailSub}
        variant="outlined"
        color="tertiary"
        style={{
          textAlign: "center",
          width: "80%",
          display: "flex",
          margin: "auto",
        }}
        onChange={onEmailChange}
        disabled={isSubscribed}
      />
      <br />

      {!isSubscribed ? (
        <>
          <div
            style={{
              width: "80%",
              marginLeft: "10%",
            }}
          >
            <StripeContainer />
          </div>
          <br />
          <Button
            color="primary"
            variant="contained"
            onClick={addSubscription}
            style={{
              display: "block",
              margin: "auto",
              textTransform: "none",
              width: "60%",
            }}
          >
            <Typography color="black" variant="subtitle1">
              subscribe
            </Typography>
          </Button>
        </>
      ) : (
        <>
          <br />
          <Button
            color="primary"
            variant="contained"
            onClick={handleUnsubscribe}
            style={{
              display: "block",
              margin: "auto",
              textTransform: "none",
              width: "60%",
            }}
          >
            <Typography color="black" variant="subtitle1">
              unsubscribe
            </Typography>
          </Button>
        </>
      )}

      <Dialog open={showUnsubscribe} onClose={handleCloseUnsubscribe}>
        <DialogTitle>Unsubscribe</DialogTitle>
        <DialogContent>
          <Typography color="secondary">
            Are you sure you want to unsubscribe?
          </Typography>
          <br />
          <Button
            color="primary"
            onClick={deleteSubscription}
            style={{
              display: "block",
              margin: "auto",
              textTransform: "none",
              width: "60%",
            }}
            variant="contained"
          >
            <Typography color="black" variant="subtitle1">
              unsubscribe
            </Typography>
          </Button>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default UserProfileComponent;
