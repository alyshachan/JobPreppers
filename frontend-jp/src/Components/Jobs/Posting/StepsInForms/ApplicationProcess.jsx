import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";

export default function ApplicationProcess() {
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
      <h2>Number of Hires</h2>
      <input type="number"></input>
      <box>
        <button>External Link to Apply</button>
        <button>Easy Apply</button>
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
