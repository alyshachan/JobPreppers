import SearchColumn from "../JobBoard/SearchColumn";
import "../JobBoard/JobSection.css";
import FilterColumn from "../JobBoard/FilterColumn";
import JobDescription from "../JobBoard/JobDescription";


function Jobs() {

  // fetch("http://localhost:5000/api/job")
  //   .then(response => {
  //       if (!response.ok) { // Check if response status is 200-299
  //           throw new Error('Network response was not ok');
  //       }
  //       return response.json();
  //   })
  //   .then(data => {
  //       console.log(data); // Log the jobs to the browser console.
  //   })
  //   .catch(error => {
  //       console.error('Error:', error); // Catch any errors (network or parsing)
  //   });

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
