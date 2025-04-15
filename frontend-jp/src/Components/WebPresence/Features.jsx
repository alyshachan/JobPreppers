import "../JobPreppers.css";
const Features = () => {
  return (
    <>
    <div className="content">
        <h1>Features</h1>
      <div className="panel !flex-row">
        <img src="/Images/temp-features/Feed_Timeline.png" className="object-contain"/>
        <div>
            <h1>Feed</h1>
            <p>
            Engage with the Job Preppers community with quick, concise updates
            about your current career journey. Type up your post and click send,
            and it will be visible to all of your connections on their own
            timeline.
            </p>
        </div>
      </div>

      <div className="w-[70%] flex flex-row">
        <div className="panel w-auto">
          <h1>Meet New People</h1>
          <p>
            Find new connections within the Job Preppers community through
            recommendations on the Feed page. Click on a user to view their
            profile and send them a connection request.
          </p>
        </div>

        <div className="panel w-auto">
          <h1>Chat</h1>
          <p>
            Chat with your connections through the messaging widget on the
            bottom right of the screen. Click the messaging button and look
            through your connections to chat back and forth with them.
          </p>
        </div>
      </div>

      <div className="panel flex-row">
        <h1>Job Board</h1>
        <p>Trang's stuff</p>
      </div>

      <div className="w-[70%] flex flex-row">
        <div className="panel">
          <h1>Bookmark</h1>
          <p>Trang more stuff</p>
        </div>

        <div className="panel">
          <h1>Add Jobs</h1>
          <p>trang even more stuff</p>
        </div>
      </div>

      <div className="panel flex-row">
        <h1>Video Call</h1>
        <p>alysha thingy</p>
      </div>

      <div className="panel flex-row">
        <h1>AI Resume Tailor</h1>
        <p>
          Upload resume via the prompts. Copy and paste a job description into
          the text box or use the job search button to auto fill a job description
          and then hit Generate Suggestions and wait for output. Then update
          resume based on suggestions
        </p>
      </div>
    </div>

    </>
  );
};

export default Features;
