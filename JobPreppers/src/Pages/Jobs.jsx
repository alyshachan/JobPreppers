import SearchColumn from "../JobBoard/SearchColumn";
import "../JobBoard/JobSection.css"
import FilterColumn from "../JobBoard/FilterColumn";
import JobDescription from "../JobBoard/JobDescription";


function Jobs() {
 return(
    <>
    <div className="job-section-container">
        <SearchColumn />
        <FilterColumn />
        <JobDescription />
    </div>
    </>
 )
}

export default Jobs;
