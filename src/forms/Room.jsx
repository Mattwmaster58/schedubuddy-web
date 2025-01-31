import { Autocomplete, Button, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Stack } from "@mui/system";
import BasicSelect from "components/FormInputs/BasicSelect";
import { useFormContext } from "context/Form";
import { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    textAlign: "center",
  },
}));

export const Form = (props) => {
  const classes = useStyles();

  const { values, handleChange, setValues } = useFormContext();
  const [roomOptions, setRoomOptions] = useState([]);

  const handleTermChange = async (e) => {
    handleChange(e);

    // Fetch rooms on term change
    try {
      const response = await fetch(`${API_URL}/api/v1/rooms/?term=${e.target.value}`);
      const data = await response.json();

      const sortedRoomsAvailable = data.objects.sort((a, b) =>
        a.location > b.location ? 1 : b.location > a.location ? -1 : 0
      );
      setRoomOptions(sortedRoomsAvailable);
    } catch (error) {
      console.log(`Error fetching rooms: ${error}`);
    }
  };

  const handleRoomChange = (_e, value) => {
    setValues({ ...values, room: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onSubmit(values);
  };

  return (
    <Stack component="form" m={1} onSubmit={handleSubmit} spacing={0.5}>
      <BasicSelect
        isObj
        label="Select a term"
        name="roomTerm"
        onChange={handleTermChange}
        options={props.terms}
        value={values.roomTerm}
      />
      <Autocomplete
        autoHighlight
        sx={{ width: "100%", marginTop: "-2%" }}
        onChange={handleRoomChange}
        options={roomOptions}
        getOptionLabel={(o) => o.location}
        renderInput={(params) => (
          <TextField
            {...params}
            margin="normal"
            label={"Select a room (e.g. CCIS 1-140)"}
          />
        )}
        value={values.room}
        noOptionsText="Select a term to see locations"
      />
      <div className={classes.buttonContainer}>
        <Button
          color="secondary"
          disabled={values.room === null}
          sx={{ mt: 1 }}
          type="submit"
          variant="contained"
        >
          Show Timetable
        </Button>
      </div>
    </Stack>
  );
};
