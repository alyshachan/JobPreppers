import AddIcon from '@mui/icons-material/Add';
import styles from "./SectionHeader.module.css"
import { IconButton } from '@mui/material';

function SectionHeader({ header, edit }) {
  return (
    <>
      <div className={styles.sectionHeader}>
        <h1>{header}</h1>
        <hr />
        
        {edit && (
        <IconButton>
          <AddIcon />
        </IconButton>
        )}
      </div>
    </>
  );
}

export default SectionHeader;
