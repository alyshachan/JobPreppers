import "../JobPreppers.css";
const Features = () => {
  return (
    <>
      <div className="content">
        <h1 className="text-6xl pb-6 bg-gradient-to-r from-[var(--jp-secondary)] to-[var(--jp-primary)] bg-clip-text text-transparent">
          Features
        </h1>
        <div className="panel !flex-row items-center">
          <img
            src="/Images/temp-features/Feed_Image.png"
            className="object-contain w-[200%]"
          />
          <div>
            <h1>Feed</h1>
            <p>
              Engage with the Job Preppers community with quick, concise updates
              about your current career journey. Type up your post and click
              send, and it will be visible to all of your connections on their
              own timeline.
            </p>
          </div>
        </div>

        <div className="w-[70%] flex flex-row">
          <div className="panel w-auto items-center">
            <div>
              <h1>Meet New People</h1>
              <p>
                Find new connections within the Job Preppers community through
                recommendations on the Feed page. Click on a user to view their
                profile and send them a connection request.
              </p>
            </div>
            <img
              src="Images/temp-features/Feed_Discover_temp.png"
              className="object-contain w-[75%]"
            />
          </div>

          <div className="panel w-auto items-center">
            <div>
              <h1>Chat</h1>
              <p>
                Chat with your connections through the messaging widget on the
                bottom right of the screen. Click the messaging button and look
                through your connections to chat back and forth with them.
              </p>
            </div>
            <img
              src="Images/temp-features/Chat_Image.png"
              className="object-contain w-[100%]"
            />
          </div>
        </div>

        <div className="panel !flex-row items-center">
          <div>
            <h1>Job Board</h1>
            <p>
              After filling out your profile and entering the Job Board page, a
              score of how suited the user is for each job is presented. There,
              the user can filter out jobs to find the one that suits them best.
            </p>
          </div>
          <img
            src="Images/temp-features/Jobs_Image.png"
            className="object-contain w-[100%]"
          />
        </div>

        <div className="w-[70%] flex flex-row">
          <div className="panel w-auto items-center">
            <div>
              <h1>Bookmark</h1>
              <p>
                As the user looks through jobs on the Job Board, they can save them
                to apply to later by clicking the bookmark icon. They can find
                their saved jobs on the Bookmarked Jobs page.
              </p>
            </div>
            <img
              src="Images/temp-features/Bookmark_Image.png"
              className="object-contain w-[200%]"
            />
          </div>

          <div className="panel w-auto items-center">
            <div>
              <h1>Add Jobs</h1>
              <p>
                Job Preppers only lets the recruiters add jobs. Located in Job
                Board, the first step of the form is a job description parser
                designed to speed up the process of adding a job. After filling
                out all the required fields and clicking submit. The new job
                will be showcased on the Job Board and Manage Jobs pages.
              </p>
            </div>
            <img
              src="Images/temp-features/Add_Job_Image.png"
              className="object-contain w-[300%]"
            />
          </div>
        </div>

        <div className="panel !flex-row items-center">
          <div>
            <h1>Video Call</h1>
            <p>
              Schedule a mock interview or join public events! Click on the
              calendar to add an event, or look for an interviewer that matches
              your needs. Join the call in your upcoming events to start a video
              call, with features such as screenshare, reactions, and recording.
            </p>
          </div>
          <img
            src="Images/temp-features/Interview_Image.png"
            className="object-contain w-[100%]"
          />
        </div>

        <div className="panel !flex-row items-center">
          <div>
            <h1>AI Resume Tailor</h1>
            <p>
              Upload resume via the prompts. Copy and paste a job description
              into the text box or use the job search button to auto fill a job
              description and then hit Generate Suggestions and wait for output.
              Then update resume based on suggestions
            </p>
          </div>
          <img
            src="Images/temp-features/Resume_Image.png"
            className="object-contain w-[100%]"
          />
        </div>
      </div>
    </>
  );
};

export default Features;
