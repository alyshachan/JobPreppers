# Job Preppers README

Overview
Job Preppers is a platform for job seekers and recruiters to connect. The application is divided into two main parts: the frontend and the backend.

Prerequisites
Before setting up, ensure you have the following installed on your system:

.NET 8.0.112 or higher (for the backend)

React.js 8.0 (for the frontend)

## How to run the application locally
### Frontend:
```
1. Create job-preppers/frontend-jp/.env
2. Add this to .env:

REACT_APP_STREAM_API_KEY=v4c5s4852hcx
REACT_APP_STREAM_APP_ID=1369184
REACT_APP_STREAM_SECRET=bg5qgk2kp87td9npmbr7r7hkxudebhjry97ts2t8pbcgpgsrcfkbjsbf5q7y7zgr
REACT_APP_JP_API_URL=http://localhost:5000
REACT_APP_JOB_API_URL=http://localhost:8000


3. Run these commands to start the frontend server
cd job-preppers/frontend-jp
npm i --legacy-peer-deps
npm run build
npm run start
```

### Backend:
```
4. In a separate terminal, run these commands to start the backend server
cd job-preppers/backend-jp
dotnet build
dotnet run
```

### Connecting to the application

```
5. Connect to http://localhost:3000.
```

### Please visit https://jobpreppers.co for the deployed version! :)

