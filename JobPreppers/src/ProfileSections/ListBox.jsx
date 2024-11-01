import React from "react";
import "./ProfileSections.css";

function ListBox({ key, title, list }) {
  const displayedItems = list.slice(0, 4);
  const hasMoreItems = list.length > 4;

  return (
    <div className="skill-box">
      <p className="section-element-title">{title}</p>

      <div className="section-element-list">
        {displayedItems.map((item, index) => (
          <React.Fragment key={index}>
            <p>{item}</p>
            {/* Only add <hr> if it's not the last item */}
            {index < displayedItems.length - 1 && <hr className="divider" />}
          </React.Fragment>
        ))}

        {/* Show 'See more' button if there are more than 4 items */}
        {hasMoreItems && (
          <div className="section-element-list-more">
            ...
            <button className="see-more">See more</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListBox;
