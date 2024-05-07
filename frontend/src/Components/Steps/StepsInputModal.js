import React, { useState } from "react";
import dayjs from "dayjs";

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

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import theme from "../../theme";
import "../../App.css";

// props: open, onCancel, reloadUserSteps, usersteps
const StepsInputModal = (props) => {
  const USER_ID = "635b5380025fdd9e3ee59b18"; // hardcoded for now

  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [id, setId] = useState("");

  const addUpdateSteps = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
      let query;
      // if id is not set, then we add
      if (id) {
        query = JSON.stringify({
          query: `mutation{updateSteps(_id: "${id}", amount: ${amount}) {_id}}`,
        });
      } else {
        query = JSON.stringify({
          query: `mutation{addSteps(user_id: "${window.sessionStorage.getItem(
            "user_id"
          )}", amount: ${amount}, date: "${date}") {_id}}`,
        });
      }

      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: query,
      });

      await response.json();

      props.reloadUserSteps();
      clearAndClose();
    } catch (error) {
      console.log(
        `Problem with ${id ? "updating" : "adding"} steps - ${error.message}`
      );
    }
  };

  // clear input, close modal
  const clearAndClose = () => {
    setAmount(0);
    setDate("");

    props.onCancel();
  };

  const onChangeDate = (newVal) => {
    setDate(newVal.format("YYYY-MM-DD"));

    // check if date already in db
    let selectStep = props.usersteps.find(
      (s) => s.date === newVal.format("YYYY-MM-DD")
    );

    if (selectStep) {
      setId(selectStep._id);
      setAmount(selectStep.amount);
    } else {
      setId("");
      setAmount(0);
    }
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  value={date}
                  onChange={onChangeDate}
                  renderInput={(props) => (
                    <TextField {...props} variant="outlined" color="tertiary" />
                  )}
                />
              </LocalizationProvider>
              <br />
              <br />
              <TextField
                label="Enter Step Count"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                variant="outlined"
                color="tertiary"
              />
              <br />
              <br />
            </div>
            <Button
              color="primary"
              onClick={addUpdateSteps}
              style={{
                display: "block",
                margin: "auto",
                textTransform: "none",
                width: "40%",
              }}
              disabled={!date || !amount}
              variant="contained"
            >
              <Typography color="black" variant="subtitle1">
                add
              </Typography>
            </Button>
          </CardContent>
        </Card>
      </Modal>
    </ThemeProvider>
  );
};

export default StepsInputModal;
