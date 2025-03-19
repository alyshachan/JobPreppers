import { TextField, Autocomplete, Checkbox } from "@mui/material";
import React, { useState, useEffect } from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Stack } from "@mui/material";
import "./Menu.css";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function Company({ setFilters, jobs }) {
  const [selectValue, setSelectValue] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);

  const handleChange = (event, newValue) => {
    // Assuming `newValue` is an array (for multiple selections)
    setSelectValue(newValue);
    setFilters((prev) => ({
      ...prev,
      company: newValue.map((company) => company.value),
    }));

    console.log(newValue);
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      const response = await fetch("https://jobpreppers.co/api/jobpost/company"); // Replace with your actual API
      if (response.ok) {
        const data = await response.json();

        console.log("Fetch Company", data);
        const uniqueCompanies = [
          ...new Set(data.jobs.map((job) => job.company)),
        ].map((company) => ({ id: company, value: company }));

        setCompanyOptions(uniqueCompanies);
      } else {
        console.error("Failed to fetch jobs");
      }
    };

    fetchCompanies();
  }, []);

  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={companyOptions}
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
      renderInput={(params) => <TextField {...params} label="Companies" />}
    />
  );
}
