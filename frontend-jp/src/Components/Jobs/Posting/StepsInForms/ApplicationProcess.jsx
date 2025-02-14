import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DialogContent, Input, InputLabel, TextField } from "@mui/material";
import { Fragment, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import ToggleButtonForm from "../Helper/ToggleButtonForm";
import dayjs from "dayjs";
import styles from "../Posting.module.css";
import { errorMessage } from "../Helper/ErrorMessage";

export default function ApplicationProcess() {
  const jobForm = useFormContext();
  const {
    register,
    control,
    resetField,
    watch,
    setValue,
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
    <DialogContent>
      <div className={styles.input}>
        <div className={styles.inputField}>
          <h2>Posting Date</h2>
          <div className={styles.twoGrid}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="postDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Post Day"
                    value={field.value ? dayjs(field.value) : null} // Ensure it's in Dayjs format
                  />
                )}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Apply By Day"
                    value={field.value ? dayjs(field.value) : null} // Ensure it's in Dayjs format
                  />
                )}
              />
            </LocalizationProvider>
          </div>
        </div>

        <div className={styles.inputField}>
          <h2>Number of Hires</h2>
          <TextField
            id="hires"
            type="number"
            label="Number of Hires"
            {...register("numberOfHires", { valueAsNumber: true, })}
          />
        </div>

        <div className={styles.inputField}>
          <h2>Apply Options</h2>
          <ToggleButtonForm
            name="applyOptions"
            control={control}
            options={applyList}
            exclusive={true}
          ></ToggleButtonForm>
          </div>
      <div>
        <h2>Posting Date</h2>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name="postDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                label="Post Day"
                value={field.value ? dayjs(field.value) : null} // Ensure it's in Dayjs format
              />
            )}
          />
        </LocalizationProvider>
        {errorMessage(errors.postDate)}

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                label="Apply By Day"
                value={field.value ? dayjs(field.value) : null} // Ensure it's in Dayjs format
              />
            )}
          />
        </LocalizationProvider>
        {errorMessage(errors.endDate)}
      </div>
      <InputLabel htmlFor="hires">Number of Hires: </InputLabel>
      <Input
        id="hires"
        type="number"
        {...register("numberOfHires", { valueAsNumber: true })}
      ></Input>
      {errorMessage(errors.numberOfHires)}

      {/* <div>
        <ToggleButtonForm
          name="applyOptions"
          control={control}
          options={applyList}
          exclusive={true}
        ></ToggleButtonForm> */}

          {/* {applyMethod == "External Apply" ? (
            <Fragment>
                <TextField
                  idlabel="applyLink"
                  type="url"
                  label="Enter External Link"
                  className="!mt-[10px]"
                  {...register("applicationLink")}
                />
            </Fragment>
          ) : applyMethod == "Easy Apply" ? (
            <Fragment>
              <h2>Required Documents</h2> */}
      <div>
        <InputLabel htmlFor="applyLink"> Enter External Link</InputLabel>
        <Input
          idlabel="applyLink"
          type="url"
          {...register("applicationLink")}
        ></Input>
        {errorMessage(errors.applicationLink)}
      </div>
      {/* {applyMethod == "External Apply" ? (
          <Fragment>
            
          </Fragment>
        ) : applyMethod == "Easy Apply" ? (
          <Fragment>
            <h2>Required Documents</h2>

              <ToggleButtonForm
                name="requiredDocuments"
                control={control}
                options={requiredDocuments}
                exclusive={false}
              ></ToggleButtonForm>
            </Fragment>
          ) : null}
        </div>
      </div>
      </DialogContent>
            <ToggleButtonForm
              name="requiredDocuments"
              control={control}
              options={requiredDocuments}
              exclusive={true}
            ></ToggleButtonForm>
            {jobForm.setValue()}
          </Fragment>
        ) : null} */}
      {/* </div> */}
      </div>
      </DialogContent>
      </>
    
  );
}
