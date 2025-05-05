import React from "react";
import { Controller } from "react-hook-form";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
const toggleButtonForm = ({ name, control, options, exclusive }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <ToggleButtonGroup
          value={field.value}
          exclusive={exclusive}
          {...field}
          onChange={(_, value) => field.onChange(value)}
        >
          {options.map((option) => (
            <ToggleButton value={option} key={option}>
              {" "}
              {option}{" "}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
    />
  );
};
export default toggleButtonForm;
