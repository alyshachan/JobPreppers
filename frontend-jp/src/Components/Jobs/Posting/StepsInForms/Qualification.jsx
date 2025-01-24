import {
  Slider,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useState } from "react";

export default function Qualification() {
  const [value, setValue] = useState([20, 40]);

  const [educationLevel, setEducationLevel] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEducationChange = (event) => {
    setEducationLevel(event.target.value);
  };

  const educationOptions = [
    "No Education",
    "High-School Diploma",
    "bachelor's degree",
    "Masters",
    "PHD",
    "Doctorates",
  ];

  /** Need to Implement  */

  return (
    <>
      <Autocomplete
        options={educationOptions}
        renderInput={(params) => (
          <TextField {...params} label="Education Level" />
        )}
      ></Autocomplete>

      <div>
        <label>Number of Years of Experience You Are Looking For:</label>
        <Slider
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
        />
      </div>
      <h2>Ask these Question to the Applicant</h2>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox />}
          label="Will you require a work visa or sponsorship now or later in the future?"
        />
        <FormControlLabel
          control={<Checkbox />}
          label="Are you legally Authorized to work in the USA"
        />
      </FormGroup>
    </>
  );
}
