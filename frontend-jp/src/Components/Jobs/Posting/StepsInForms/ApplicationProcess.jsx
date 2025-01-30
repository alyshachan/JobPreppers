import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  ToggleButtonGroup,
  ToggleButton,
  Input,
  InputLabel,
  Button,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import ToggleButtonForm from "../Helper/ToggleButtonForm";

export default function ApplicationProcess() {
  const jobForm = useFormContext();
  const {
    register,
    handleSubmit,
    control,
    resetField,
    watch,
    getValues,
    formState: { errors },
  } = jobForm;
  const applyList = ["External Apply", "Easy Apply"];
  const applyMethod = watch("applyOptions");

  useEffect(() => {
    if (applyMethod == "Easy Apply") {
      resetField("applicationLink");
    }
  }, [applyMethod]);
  const requiredDocuments = [
    "Resume",
    "Cover-Letter",
    "Transcipt",
    "Job Prepper Profile",
  ];

  return (
    <>
      <div>
        <h2>Posting Date</h2>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name="postDay"
            control={control}
            render={({ field }) => <DatePicker {...field} label="Post Day" />}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name="closeDay"
            control={control}
            render={({ field }) => <DatePicker {...field} label="Close Day" />}
          />
        </LocalizationProvider>
      </div>
      <InputLabel htmlFor="hires">Number of Hires: </InputLabel>
      <Input id="hires" type="number" {...register("numberOfHires")}></Input>
      <div>
        <ToggleButtonForm
          name="applyOptions"
          control={control}
          options={applyList}
          exclusive={true}
        ></ToggleButtonForm>

        {applyMethod == "External Apply" ? (
          <Fragment>
            <div>
              <InputLabel htmlFor="applyLink"> Enter External Link</InputLabel>
              <Input
                idlabel="applyLink"
                type="url"
                {...register("applicationLink")}
              ></Input>
            </div>
          </Fragment>
        ) : applyMethod == "Easy Apply" ? (
          <Fragment>
            <h2>Required Documents</h2>

            <ToggleButtonForm
              name="requiredDocuments"
              control={control}
              options={requiredDocuments}
              exclusive={true}
            ></ToggleButtonForm>
          </Fragment>
        ) : null}
      </div>
    </>
  );
}
