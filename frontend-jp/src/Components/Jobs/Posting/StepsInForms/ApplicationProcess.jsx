import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useState } from "react";
export default function ApplicationProcess() {
  const [applyMethod, setApplyMethod] = useState("");

  const handleChange = (event, newApplyMethod) => {
    setApplyMethod(newApplyMethod);
  };

  return (
    <>
      <div>
        <h2>Posting Date</h2>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Post Day" />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Close Post Day" />
        </LocalizationProvider>
      </div>
      <label for="hires">Number of Hires: </label>
      <input id="hires" type="number"></input>
      <box>
        <ToggleButtonGroup
          value={applyMethod}
          exclusive
          onChange={handleChange}
        >
          <ToggleButton value="External Apply">External Apply</ToggleButton>
          <ToggleButton value="Easy Apply">Easy Apply</ToggleButton>
        </ToggleButtonGroup>
      </box>
      <div>
        <h2>Required Documents</h2>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Resume"
          />
          <FormControlLabel control={<Checkbox />} label="Cover-Letter" />
          <FormControlLabel control={<Checkbox />} label="Transcript" />
          <FormControlLabel
            control={<Checkbox />}
            label="Job Prepper Profile"
          />
        </FormGroup>
      </div>
    </>
  );
}
