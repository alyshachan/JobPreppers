import { TextField, Autocomplete, Checkbox, Button } from "@mui/material";
import React, { useState } from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import "./Menu.css";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const JobType = ({ setFilters }) => {
  // Memoizing the options list to avoid unnecessary re-renders
  const List_Value = [
    { id: 0, value: "Full-Time" },
    { id: 1, value: "Part-Time" },
    { id: 2, value: "Internship" },
    { id: 3, value: "On-Campus" },
    { id: 4, value: "Fellowship" },
    { id: 5, value: "Graduate" },
    { id: 6, value: "Volunteer" },
  ];

  const [value, setValue] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue); // Updates selectValue state
    console.log("New Value: ", newValue); // Logs the latest selection
    setFilters((prev) => ({
      ...prev,
      type: newValue.map((type) => type.value), // Uses latest selection for filters
    }));
  };

  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      className="drop-down"
      options={List_Value}
      disableCloseOnSelect
      value={value}
      onChange={handleChange}
      limitTags={1}
      getOptionLabel={(option) => option.value}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;
        console.log(optionProps, "is selected:", selected);

        return (
          <li key={key} {...optionProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.value}
          </li>
        );
      }}
      renderInput={(params) => <TextField {...params} label="Job Type" />}
    />
  );
};

export default JobType;
