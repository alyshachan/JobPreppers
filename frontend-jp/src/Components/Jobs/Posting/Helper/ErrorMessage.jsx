import styles from "../Posting.module.css";
import ErrorIcon from "@mui/icons-material/Error";
import { red } from "@mui/material/colors";
export const errorMessage = (speficError) => {
  return (
    <>
      {speficError && (
        <div className={styles.error}>
          <ErrorIcon sx={{ color: red[500] }} />
          {speficError.message}
        </div>
      )}
    </>
  );
};
