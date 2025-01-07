import "./SectionHeader.css";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

import { IconButton } from '@mui/material';

function SectionHeader({ header, edit }) {
  return (
    <>
      <div className="section-header">
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
