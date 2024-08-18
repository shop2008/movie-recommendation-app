# Movie Recommendation App

Welcome to the Movie Recommendation App! This project provides personalized movie suggestions using React for the front-end, Firebase Functions for the back-end, and the Gemini API for generating content.

## Features

- **Personalized Recommendations**: Get movie suggestions based on your preferences.
- **Dynamic UI**: User-friendly interface with movie images and category selection.
- **User Authentication**: Login and registration functionality.
- **Liked Movies**: Users can like movies and view their liked movies list.
- **Theme Customization**: Multiple color themes to choose from.
- **Serverless Deployment**: Deployed on Firebase Hosting with serverless backend functions.

## Tech Stack

- **Front-End**: React, Tailwind CSS
- **Back-End**: Firebase Functions (Node.js)
- **API Integration**: Gemini API, OMDB API
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Hosting**: Firebase Hosting

## Getting Started

To get started with this project, follow these steps:

### Prerequisites

- Node.js and npm installed
- Firebase CLI installed (`npm install -g firebase-tools`)



### Set Up the Front-End

1. Navigate to the `frontend` folder and install the dependencies:

```bash
cd frontend
pnpm install
```

2. Create a `.env` file in the `frontend` directory and add your Firebase configuration:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Set Up the Back-End

1. Navigate to the `functions` folder and install the dependencies:

```bash
cd ../functions
pnpm install
```

2. Create a `.env` file in the `functions` directory and add your API keys:

```
GEMINI_API_KEY=your_gemini_api_key
OMDB_API_KEY=your_omdb_api_key
```

### Configure Firebase

1. Log in to Firebase CLI:

```bash
firebase login
```

2. Initialize your Firebase project:

```bash
firebase init
```

Select Hosting and Functions when prompted.

### Run the App Locally

1. Start the front-end development server:

```bash
cd ../frontend
pnpm start
```

2. In a separate terminal, start the Firebase emulators:

```bash
firebase emulators:start
```

### Deployment

To deploy the app to Firebase:

```bash
pnpm run build
firebase deploy
```

## License

This project is licensed under the MIT License.