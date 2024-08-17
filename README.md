# Movie Recommendation App

Welcome to the Movie Recommendation App! This project provides personalized movie suggestions using React for the front-end, Node.js for the back-end, and the Gemini API for generating content.

## Features

- **Personalized Recommendations**: Get movie suggestions based on your preferences.
- **Dynamic UI**: User-friendly interface with movie images and category selection.
- **Serverless Deployment**: Deployed on Firebase Hosting with serverless backend functions.

## Tech Stack

- **Front-End**: React
- **Back-End**: Node.js
- **API Integration**: Gemini API
- **Hosting**: Firebase Hosting
- **Serverless Functions**: Firebase Functions

## Getting Started

To get started with this project, follow these steps:

### Prerequisites

- Node.js and npm installed
- Firebase CLI installed

### Clone the Repository

```bash
git clone https://github.com/shop2008/movie-recommendation-app.git
cd movie-recommendation-app
```

### Set Up the Front-End

Navigate to the `frontend` folder and install the dependencies:

```bash
cd frontend
npm install
```

### Set Up the Back-End

Navigate to the `backend` folder and install the dependencies:

```bash
cd ../backend
npm install
```

### Configure Firebase

1. Create a Firebase project and add your configuration details to the project.
2. Deploy your functions and hosting:

```bash
firebase deploy
```

### Run the App Locally

Start the front-end development server:

```bash
cd ../frontend
npm start
```

Start the back-end server:

```bash
cd ../backend
node index.js
```
