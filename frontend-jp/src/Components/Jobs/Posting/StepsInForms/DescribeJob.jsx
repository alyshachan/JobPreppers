import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Select,
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
        <InputLabel for="employmentTypeLabel">Employment Type</InputLabel>
        <Select
          labelId="employmentTypeLabel"
          id="selectEmploymentType"
          value={employmentType}
          label="Employement Type"
          onChange={handleChangeEmployment}
        >
          <MenuItem value="" disabled>
            Employment Type
          </MenuItem>
          <MenuItem value="Full-Time">Full-Time</MenuItem>
          <MenuItem value="Part-Time">Part-Time</MenuItem>
          <MenuItem value="Internship">Internship</MenuItem>
          <MenuItem value="PRN">PRN</MenuItem>
          <MenuItem value="Apprentices">Apprentices</MenuItem>
        </Select>

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

        <input type="submit"></input>
      </form>
    </>
  );
}
