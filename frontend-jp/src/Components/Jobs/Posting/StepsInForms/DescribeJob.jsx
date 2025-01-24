import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Autocomplete,
  InputLabel,
  MenuItem,
  TextField,
  FormControl,
} from "@mui/material";

export default function DescribeJob() {
  const onSubmit = (data) => {
    console.log(data);
  };

  const schema = yup.object().shape({
    companyName: yup.string().required(),
    jobTitle: yup.string().required(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [employmentType, setEmploymentType] = useState("");

  const handleChangeEmployment = (event) => {
    setEmploymentType(event.target.value);
  };

  const employementTypeOptions = [
    "Full-Time",
    "Part-Time",
    "Internship",
    "PRN",
    "Apprentices",
  ];

  // Step 1

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register("companyName")}
          type="text"
          label="Company Name"
        />
        <TextField {...register("location")} label="Location" />
        <TextField {...register("jobTitle")} label="Job Title" />
        <Autocomplete
          options={employementTypeOptions}
          renderInput={(params) => (
            <TextField {...params} label="Employment Type" />
          )}
        ></Autocomplete>

        {/* Seniority Level */}
        {/* <InputLabel for="seniorityLabel">Seniority Level</InputLabel> */}

        {/* <Select
          labelId="seniorityLabel"
          id="selectsenioriy"
          label="Employement Type"
          onChange={handleChangeEmployment}
        >
          <MenuItem value="Entry">Entry-Level</MenuItem>
          <MenuItem value="Associate">Associate</MenuItem>
          <MenuItem value="Senior">Senior</MenuItem>
        </Select> */}

        {/* Job Function */}

        <TextField {...register("Job Desciption")} label="Job Description" />

        {/* <input type="submit"></input> */}
      </form>
    </>
  );
}
