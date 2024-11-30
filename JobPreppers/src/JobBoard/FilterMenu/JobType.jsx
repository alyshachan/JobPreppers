import { TextField, Autocomplete, Checkbox } from "@mui/material";
import React, { useState } from "react";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import "./Menu.css";


const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const JobType = () => {
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

  const [selectValue, setSelectValue] = useState([]);

  // Handle changes in the selection
  const handleValueChange = (event) => {

    setSelectValue(event.target.value); // This will update the selected values
  };

  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      className="drop-down"
      options={List_Value}
      limitTags={1}
      disableCloseOnSelect
      getOptionLabel={(option) => option.value}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8}}
              checked={selected}
            />
            {option.value}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField {...params} label="Job Type"
       />
      )}
    />
  );
};

export default JobType;
