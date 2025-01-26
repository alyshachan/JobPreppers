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
  const [value, setValue] = useState([0, 2]);

  const [educationLevel, setEducationLevel] = useState("");

  const [experienceLabel, setExperienceLevel] = useState("Entry Level");

  const handleExperienceLabel = () => {};

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue[0] < 2) {
      setExperienceLevel("Entry Level");
    } else if (newValue[0] < 5) {
      setExperienceLevel("Associate");
    } else if (newValue[0] < 10) {
      setExperienceLevel("Mid Level");
    } else {
      setExperienceLevel("Senior");
    }
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
        <label>
          Number of Years of Experience You Are Looking For: {experienceLabel}
        </label>
        <Slider
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          max={10}
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
