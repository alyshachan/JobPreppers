import { TextField, Autocomplete, Checkbox } from "@mui/material";
import React, { useState, useEffect } from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Stack } from "@mui/material";
import "./Menu.css";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const List_Value = [
  { id: 0, value: "Full-Time" },
  { id: 1, value: "Part-Time" },
  { id: 2, value: "Internship" },
  { id: 3, value: "On-Campus" },
  { id: 4, value: "Fellowship" },
  { id: 5, value: "Graduate" },
  { id: 6, value: "Volunteer" },
]; 

export default function JobType({ setFilters }) {
  const [selectValue, setSelectValue] = useState([]);

  const handleChange = (event, newValue) => {
    // Assuming `newValue` is an array (for multiple selections)
    setSelectValue(newValue);
    setFilters((prev) => ({
      ...prev,
      type: newValue.map((type) => type.value),
    }));

    console.log(newValue);
  };


  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={List_Value}
      className="drop-down"
      disableCloseOnSelect
      value={selectValue}
      onChange={handleChange}
      limitTags={1}
      getOptionLabel={(option) => option.value}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;
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
}
