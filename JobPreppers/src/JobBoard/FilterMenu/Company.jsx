import { TextField, Autocomplete, Checkbox } from "@mui/material";
import React, { useState } from "react";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {Stack} from "@mui/material";
import "./Menu.css";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// Need to connect to Job Search
const companies = [
    { id: 0, value: "Amazon" },
    { id: 1, value: "Google" },
    { id: 2, value: "Micron" },
    { id: 3, value: "Lucid" },
    { id: 4, value: "L3Harris" },
    { id: 5, value: "DoorDash" },
  ];

export default function Company(){
    
      return (
        <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={companies}
      className="drop-down"
      disableCloseOnSelect
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
      renderInput={(params) => (
        <TextField {...params} label="Companies" 
          />
      )}
    />
    );

    
    };
    