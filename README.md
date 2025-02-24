# HireIn - Job Portal

HireIn is a progressive Recruitment Management System (RMS) designed to modernize and streamline the hiring process for recruiters and candidates. Leveraging modern web technologies and an intuitive interface, HireIn automates job posting, application tracking, and candidate management to improve efficiency and enhance user experience.

## Live Hosted link using Vercel
https://hire-in-jp.vercel.app

## Table of Contents
- [Live Hosted Link](#live-hosted-link-using-vercel)
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Acknowledgements](#acknowledgements)
- [References](#references)

## Overview
HireIn addresses the common challenges in traditional recruitment processes by:
- Simplifying job posting and application tracking.
- Providing a secure and user-friendly platform for recruiters and candidates.
- Enabling efficient candidate management with integrated resume generation and filtered search options.

By automating routine tasks and fostering transparent communication, HireIn paves the way for a seamless recruitment experience.

## Features
- **Job Posting:** Effortlessly post and manage job listings.
- **Application Tracking:** Allow candidates to apply, track their applications, and receive real-time updates.
- **User Authentication:** Secure sign-in and registration powered by Firebase.
- **Profile Management:** Maintain user profiles complete with personal information, skills, and a resume generator.
- **Filtered Search:** Advanced search filters for job listings based on job type, eligibility, timings, and more.

## Technologies Used

### Frontend
- **HTML & Tailwind CSS:** For structuring and styling the web interface.
- **JavaScript & ReactJS:** To build dynamic and responsive user interfaces with reusable components.

### Backend
- **Firebase:**
  - **Firebase Authentication:** For secure user login and account management.
  - **Firebase Security Rules:** To manage data access and ensure confidentiality.

## Installation

To run HireIn locally, follow these steps:

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/yourusername/HireIn.git
    ```
2. **Install Dependencies:**
    ```bash
    cd HireIn
    npm install
    ```
3. **Configure Firebase:**
    - Create a Firebase project.
    - Replace the Firebase configuration in your project with your project's credentials.
4. **Run the Project:**
    ```bash
    npm start
    ```
The application will run on `http://localhost:3000`.

## Usage

- **For Recruiters:** Log in to post job listings, view applications, and manage candidate data.
- **For Candidates:** Sign up, create a detailed profile and explore job listings using advanced filters.
- **Navigation:** An intuitive navigation bar allows users to quickly switch between Home, Profile, and Contact sections.

## Project Structure

```
HireIn/
├── public/
│   ├── index.html
│   └── manifest.json
│
├── src/
│   ├── assets/
│   │   ├── Home.png
│   │   ├── SignUp.png
│   │   ├── Phones.png
│   │   ├── job-image-1.png
│   │   ├── job-image-2.png
│   │   ├── Candidate.png
│   │   └── Employer.png
│   │
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── JobItem.jsx
│   │   ├── OAuth.jsx
│   │   ├── PrivateRoute.jsx
│   │   ├── Slide.jsx
│   │   └── Spinner.jsx
│   │
│   ├── hooks/
│   │   └── useAuthStatus.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── SignIn.jsx
│   │   ├── SignUp.jsx
│   │   ├── Profile.jsx
│   │   ├── FindJobs.jsx
│   │   ├── UploadJob.jsx
│   │   └── Job.jsx
│   │
│   ├── App.jsx
│   ├── index.js
│   ├── index.css
│   └── firebase.js
│
├── .env
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md
```

## Acknowledgements

- Special thanks to Ms. Ankitha Shetty, Assistant Professor at the Department of Artificial Intelligence & Data Science, for her guidance.
- Gratitude to all team members, mentors, and contributors who supported the development of HireIn.

## References

- [React & Firebase Projects with Sahand - Realtor Clone PART 1](https://www.youtube.com/watch?v=b0_Y_eU_SXI)
- [React & Firebase Projects with Sahand - Realtor Clone PART 2](https://www.youtube.com/watch?v=fJ3UpxNanBE)
- [React Documentation](https://react.dev/)
- [MDN Web Docs](https://developer.mozilla.org)
- [Firebase Documentation](https://firebase.google.com/docs)
