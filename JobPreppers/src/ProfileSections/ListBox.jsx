import React from "react";
import "../Components/JobPreppers.css"
import styles from "../Components/Profile/ProfileSections.module.css"
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

function ListBox({
  key,
  title,
  list,
  edit,
  sliceItems = true,
  showAllItems = false,
}) {
  const displayedItems = sliceItems ? list.slice(0, 4) : list;
  const hasMoreItems = list.length > 4 && !showAllItems;

  return (
    <div className={styles.skillBox}>
      {edit ? (
        <div className="flex flex-row justify-between">
          <p className="section-element-title">{title}</p>
          <IconButton>
            <EditIcon />
          </IconButton>
        </div>
      ) : (
        <p className="title">{title}</p>
      )}

      <div className={styles.skillList}>
        {displayedItems.map((item, index) => (
          <React.Fragment key={index}>
            <p>{item}</p>
            {/* Only add <hr> if it's not the last item */}
            {index < displayedItems.length - 1 && <hr className={styles.skillDivider} />}
          </React.Fragment>
        ))}

        {/* Show 'See more' button if there are more than 4 items and showAllItems is false */}
        {hasMoreItems && !showAllItems && (
          <div className={styles.skillMoreList}>
            ...
            <button className="lightButton">See more</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListBox;
