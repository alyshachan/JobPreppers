import React from "react";
import { Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const autoCompleteForm = ({ control, name, options, label }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Autocomplete
          {...field}
          options={options}
          value={field.value || null}
          onChange={(_, value) => field.onChange(value)}
          renderInput={(params) => <TextField {...params} label={label} />}
        />
      )}
    />
  );
};
export default autoCompleteForm;
