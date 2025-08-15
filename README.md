# Vero Chat Assistant

Vero Chat Assistant is a modern chatbot platform designed to streamline how you collect and manage client information. Automate your onboarding, improve data accuracy, and deliver a friendly experience to your clients—all in one place.

## Features

*   **Conversational Data Collection:** A friendly chatbot interface guides users through a series of questions.
*   **Admin Dashboard:** A secure admin dashboard allows you to view and manage the collected client data.
*   **Data Visualization:** The admin dashboard includes a chart to visualize the most popular services.
*   **Serverless Architecture:** The application is built with a serverless architecture using Firebase, making it easy to deploy and scale.

## Technologies Used

*   **Front-End:** HTML, CSS, JavaScript
*   **Back-End:** Firebase (Firestore, Authentication)
*   **Charting Library:** Chart.js

## Setup and Installation

1.  **Clone the repository:**
    ```
    git clone https://github.com/your-username/vero-chat-assistant.git
    ```
2.  **Create a Firebase project:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
    *   Add a web app to your project.
    *   Enable Firestore and Authentication.
    *   In the Authentication section, add an admin user.
    *   In the Firestore section, update your security rules to the following:
        ```
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /clients/{clientId} {
              allow create: if true;
              allow read: if request.auth != null;
            }
            match /metadata/clients {
              allow read, write: if true;
            }
          }
        }
        ```
3.  **Add your Firebase configuration:**
    *   In your Firebase project settings, find your `firebaseConfig` object.
    *   Copy this object and paste it into the `firebase-config.js` file.
4.  **Open the `index.html` file in your browser.**

## Future Improvements

*   Add more robust data validation to the chatbot.
*   Add more data visualization options to the admin dashboard.
*   Implement user roles (e.g., admin, editor).