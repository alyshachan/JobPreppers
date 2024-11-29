import SearchColumn from "../JobBoard/SearchColumn";
import "../JobBoard/JobSection.css";
import FilterColumn from "../JobBoard/FilterColumn";
import JobDescription from "../JobBoard/JobDescription";

function Jobs() {
  return (
    <>
      <div className="content">
        <div className="main-panel !bg-transparent !shadow-none !p-0 items-center">
          <SearchColumn />
          <FilterColumn />
        </div>
        <JobDescription />
      </div>
    </>
  );
}

export default Jobs;
