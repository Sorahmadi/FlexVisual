//#region Imports
import React, { useState } from "react";
import dayjs from "dayjs";
import { ThemeProvider } from "@mui/material/styles";
import { Button, Modal, Card, CardContent, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import theme from "../theme";
import "../App.css";
//#endregion

const CaloriesInputModal = (props) => {
  //#region State Variables
  //State variables for user input
  const [amount, setAmount] = useState(0);
  const [date, setDate] = React.useState(dayjs());
  //#endregion

  //#region On Change Methods
  const onAmountChange = function (e) {
    setAmount(e.target.value);
  };
  const onDateChange = (newValue) => {
    setDate(newValue);
  };
  //#endregion

  //#region Database Queries
  const addCalories = async () => {
    console.log(date.toString());

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
      let query = JSON.stringify({
        query: `mutation{addCalories(user_id: "${window.sessionStorage.getItem(
          "user_id"
        )}", amount: ${amount}, date: "${date.toString()}") {user_id, amount, date}}`,
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

      //Reload the calories on the previous page
      props.reloadUserCalories();

      //Clear and Close the modal
      clearAndClose();
    } catch (error) {
      console.log(`Problem updating calories - ${error.message}`);
    }
  };
  //#endregion

  const clearAndClose = async () => {
    //Clear the previous input data so it is empty
    //when the next calories is added
    setAmount(0);
    setDate(dayjs());

    //Close the modal
    props.onCancel();
  };

  return (
    //#region JSX
    <ThemeProvider theme={theme}>
      <Modal
        open={props.open}
        className="centerAlign"
        style={{ marginLeft: "5%", marginRight: "5%" }}
      >
        <Card>
          <CardContent>
            <TextField
              label="Amount of Calories"
              value={amount}
              onChange={onAmountChange}
            />
            <br />
            <br />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Date"
                value={date}
                onChange={onDateChange}
                renderInput={(props) => <TextField {...props} />}
              />
            </LocalizationProvider>
            <br />
            <br />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="contained" color="success" onClick={addCalories}>
                Add
              </Button>
              <Button variant="contained" color="error" onClick={clearAndClose}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </Modal>
    </ThemeProvider>
    //#endregion
  );
};

export default CaloriesInputModal;
