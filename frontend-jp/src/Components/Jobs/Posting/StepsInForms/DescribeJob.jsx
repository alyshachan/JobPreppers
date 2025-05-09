import { useFormContext } from "react-hook-form";
import { DialogContent, TextField } from "@mui/material";
import AutoCompleteForm from "../Helper/AutoCompleteForm";
import styles from "../Posting.module.css";
import { errorMessage } from "../Helper/ErrorMessage";
import axios from "axios";
import TipTap from "../Helper/TipTap";
import React, { useEffect } from "react";

export default function DescribeJob({
  formData,
  setFormData,
  jobDescriptionData,
}) {
  const jobForm = useFormContext();
  const onSubmit = (data) => {
    setFormData({ ...formData, ...data });
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = jobForm;

  const submitAddress = async (location) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      location
    )}&format=json`;

    if (!location) {
      alert("Please enter a location.");
      return;
    }
    try {
      const response = await axios.get(url);
      if (response.data && response.data.length > 0) {
        return response.data[0];
      } else {
        console.log("No results found for the location");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const employementTypeOptions = [
    { value: 1, label: "Full-Time" },
    { value: 2, label: "Part-Time" },
    { value: 3, label: "Internship" },
    { value: 4, label: "PRN" },
    { value: 5, label: "Apprentices" },
  ];

  const registerAddress = async (location) => {
    try {
      if (location) {
        let lower = location.toLowerCase();
        if (lower.match("remote")) {
          setValue("latitude", null);
          setValue("longitude", null);
        } else {
          const { lat, lon } = await submitAddress(location);
          if (lat && lon) {
            setValue("latitude", lat);
            setValue("longitude", lon);
            setValue("location", location);
          } else {
            console.log("Please enter a correct location");
          }
        }
      }
    } catch (e) {
      console.log("Couldn't find the address, please check spelling");
    }
  };

  useEffect(() => {
    if (jobDescriptionData.title) {
      setValue("title", jobDescriptionData.title);
    }

    if (jobDescriptionData.type) {
      for (let option of employementTypeOptions) {
        const label = option.label;

        const normalizeString = (str) =>
          str.toLowerCase().replace(/[\s-]+/g, "");

        const matchingOption = employementTypeOptions.find(
          (option) =>
            normalizeString(option.label) ===
            normalizeString(jobDescriptionData.type)
        );
        if (matchingOption) {
          setValue("type", option);
          break;
        }
      }
    }

    if (jobDescriptionData.location) {
      const location = jobDescriptionData.location;
      try {
        registerAddress(location);
      } catch (error) {
        console.log("Not right location");
      }
    }
  }, [jobDescriptionData]);

  // Step 1

  return (
    <>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <div className={`${styles.dialogContent} pt-2`}>
              <div className={styles.dialogContentLeft}>
                <div className={styles.input}>
                  <div className={styles.inputField}>
                    <TextField
                      {...register("company")}
                      required
                      type="text"
                      label="Company Name"
                    />
                  </div>
                  {errorMessage(errors.company)}

                  <div className={styles.inputField}>
                    <TextField
                      {...register("title")}
                      required
                      label="Job Title"
                    />
                    {errorMessage(errors.title)}
                  </div>
                </div>
              </div>

              <div className={styles.dialogContentRight}>
                <div className={styles.input}>
                  <div className={styles.inputField}>
                    <TextField
                      {...register("location")}
                      label="Location *"
                      onBlur={async (e) => {
                        const location = e.target.value;
                        registerAddress(location);
                      }}
                    />
                    {errorMessage(errors.location)}
                  </div>
                  <div className={styles.inputField}>
                    <AutoCompleteForm
                      control={control}
                      name="type"
                      options={employementTypeOptions}
                      label="Employment Type *"
                    />
                    {errorMessage(errors.type)}
                  </div>
                </div>
              </div>
            </div>

            <label for="description" className={`${styles.label} mt-[10px]`}>
              Job Description *
            </label>
            <div>
              <TipTap control={control} name="description"></TipTap>
            </div>
            {errorMessage(errors.description)}
          </div>
        </form>
      </DialogContent>
    </>
  );
}
