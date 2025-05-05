import React from "react";
import "../Components/JobPreppers.css";
import styles from "../Components/Profile/ProfileSections.module.css";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

function ListBox({
  key,
  title,
  list,
  edit,
  sliceItems = true,
  showAllItems = false,
  onEdit,
  visitingUser
}) {
  const displayedItems = sliceItems ? list.slice(0, 4) : list;
  const hasMoreItems = list.length > 4 && !showAllItems;

  return (
    <div className={styles.skillBox}>
      <p className="title">{title}</p>

      <div className={styles.skillList}>
        {displayedItems.map((item, index) => {
          const itemCategory = {...item, category: title};
          return(
          <React.Fragment key={item.userSkillID || index}>
            {edit ? (
              <div className="flex justify-between">
                <p>{item.name}</p>
                <IconButton onClick={() => onEdit(itemCategory)}>
                  <EditIcon />
                </IconButton>
              </div>
            ) : (
              <p>{item.name}</p>
            )}
            {/* Only add <hr> if it's not the last item */}
            {index < displayedItems.length - 1 && (
              <hr className={styles.skillDivider} />
            )}
          </React.Fragment>
          )
})}

        {/* Show 'See more' button if there are more than 4 items and showAllItems is false */}
        {hasMoreItems && !showAllItems && (
          <div className={styles.skillMoreList}>
            ...
            <a href={`/Skills/${visitingUser}`}>
              <button className="lightButton">See more</button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListBox;
