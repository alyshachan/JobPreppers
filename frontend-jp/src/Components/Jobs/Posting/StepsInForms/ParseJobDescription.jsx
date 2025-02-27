import { useFormContext } from "react-hook-form";
import { DialogContent } from "@mui/material";
import styles from "../Posting.module.css";
import TipTap from "../Helper/TipTap";
import { errorMessage } from "../Helper/ErrorMessage";
export default function ParseJobDescription({ formData, setFormData }) {
  const jobForm = useFormContext();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = jobForm;
  return (
    <>
      <DialogContent>
        <div className={styles.parseJobContainer}>
          <div className={styles.parseHeader}>
            <label for="description" className={`${styles.label} mt-[10px]`}>
              Job Description *
            </label>
            {/* <button>Parse Job Description</button> */}
          </div>

          <div>
            <TipTap control={control} name="description"></TipTap>
          </div>
          {errorMessage(errors.description)}
        </div>
      </DialogContent>
    </>
  );
}
