import AddIcon from '@mui/icons-material/Add';
import styles from "./ProfileSections.module.css"
import { IconButton } from '@mui/material';

function SectionHeader({ header, edit, onAdd }) {
  return (
    <>
      <div className={styles.sectionHeader}>
        <h1>{header}</h1>
        <hr />
        
        {edit && (
        <IconButton>
          <AddIcon onClick={onAdd} />
        </IconButton>
        )}
      </div>
    </>
  );
}

export default SectionHeader;
