import { yupResolver } from "@hookform/resolvers/yup";
import { useFormContext } from "react-hook-form";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import AutoCompleteForm from "../Helper/AutoCompleteForm";

export default function DescribeJob({ formData, setFormData }) {
  const jobForm = useFormContext();
  const onSubmit = (data) => {
    console.log(data);
    setFormData({ ...formData, ...data });
  };
  // const schema = yup.object().shape({
  //   companyName: yup.string().required(),
  //   jobTitle: yup.string().required(),
  // });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = jobForm;

  // useEffect(() => {
  //   jobForm.reset({}, { resolver: yupResolver(schema) });
  // }, [jobForm]);

  const employementTypeOptions = [
    { value: 1, label: "Full-Time" },
    { value: 2, label: "Part-Time" },
    { value: 3, label: "Internship" },
    { value: 4, label: "PRN" },
    { value: 5, label: "Apprentices" },
  ];

  // Step 1

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField {...register("company")} type="text" label="Company Name" />
        <TextField {...register("location")} label="Location" />
        <TextField {...register("title")} label="Job Title" />
        <AutoCompleteForm
          control={control}
          name="type"
          options={employementTypeOptions}
          label="Employment Type"
        />

        <TextField {...register("description")} label="Job Description" />
      </form>
    </>
  );
}
