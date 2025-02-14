import { useFormContext } from "react-hook-form";
import { DialogContent, TextField } from "@mui/material";
import AutoCompleteForm from "../Helper/AutoCompleteForm";
import styles from "../Posting.module.css";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { errorMessage } from "../Helper/ErrorMessage";
import axios from "axios";
export default function DescribeJob({ formData, setFormData }) {
  const jobForm = useFormContext();
  const onSubmit = (data) => {
    console.log(data);
    setFormData({ ...formData, ...data });
  };

  const {
    register,
    handleSubmit,
    setValue,
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

  // Step 1

  return (
    <>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <div className={styles.dialogContent}>
              <div className={styles.dialogContentLeft}>
                <div className={styles.input}>
                  <TextField
                    {...register("company")}
                    required
                    type="text"
                    label="Company Name"
                    className={styles.inputField}
                  />
                  {errorMessage(errors.company)}
                </div>

                <div className={styles.input}>
                  <TextField
                    {...register("title")}
                    required
                    label="Job Title"
                    className={styles.inputField}
                  />
                  {errorMessage(errors.title)}
                </div>
              </div>

              <div className={styles.dialogContentRight}>
                <div className={styles.input}>
                  <TextField
                    {...register("location")}
                    label="Location *"
                    className={styles.inputField}
                    onBlur={async (e) => {
                      const location = e.target.value;
                      try {
                        if (location) {
                          const { lat, lon } = await submitAddress(location);
                          console.log("Fetched coordinates:", lat, lon);
                          if (lat && lon) {
                            setValue("latitude", lat);
                            setValue("longitude", lon);
                          } else {
                            alert("Please enter a correct location");
                          }
                        }
                      } catch (e) {
                        alert(
                          "Couldn't find the address, please check spelling"
                        );
                      }
                    }}
                  />
                  {errorMessage(errors.location)}
                </div>

                <AutoCompleteForm
                  control={control}
                  name="type"
                  options={employementTypeOptions}
                  label="Employment Type *"
                  className={styles.inputField}
                />
                {errorMessage(errors.type)}
              </div>
            </div>

            <label for="description" className={styles.label}>
              Job Description *
            </label>
            <TextareaAutosize
              {...register("description")}
              required
              label="Job Description"
              placeholder="Enter Job Description"
            />
            {errorMessage(errors.description)}
          </div>
        </form>
      </DialogContent>
    </>
  );
}
