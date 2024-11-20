import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";

function Jobs() {
  return (
    <>
      <div className="content">
        <h1>Jobs</h1>
        <TextField
          label="Search Bar"
          id="outlined-start-adornment"
          className="mt-8 bg-white w-[500px]"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                  <CloseOutlinedIcon />
                </InputAdornment>
              ),
            },
          }}
        />

        <FormControl variant="outlined" className="m-8">
          <InputLabel htmlFor="">Search</InputLabel>
          <OutlinedInput
            id="search"
            type="text"
            className="bg-white w-[500px]"
            placeholder="Search"
            endAdornment={
              <InputAdornment position="end">
                <IconButton edge="end">
                  <SearchIcon />
                </IconButton>

                <IconButton edge="end">
                  <CloseOutlinedIcon />
                </IconButton>
              </InputAdornment>
            }
            label="Search"
          />
        </FormControl>
      </div>
    </>
  );
}

export default Jobs;
