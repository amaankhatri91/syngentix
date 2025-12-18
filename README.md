# React + TypeScript + Vite

#Live Url - https://live-Syngentix.onrender.com/

This project is built using React, TypeScript, and Vite as the build tool. Vite provides a fast and optimized development experience with features like hot module replacement (HMR).

## Installation

To get started with this project, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd <your-project-directory>
   npm install
   npm start

Password Validation
The password for the application must meet the following criteria:

Minimum length: 5 characters
Contains at least:
One lowercase letter
One uppercase letter
One digit
The password validation is implemented using Yup:

# password: Yup.string()
    .required('Required')
      .min(5, 'Min length is 5')
      .matches(/[a-z]/, 'Must have lowercase letter')
      .matches(/[A-Z]/, 'Must have uppercase letter')
      .matches(/[0-9]/, 'Must have digit'), 


# Password validation has been commented out because the actual password does not contain these conditions, so it will not allow the form to be submitted.

### Instructions:
- Replace `<your-repo-url>` with the actual URL of your repository.
- Replace `<your-project-directory>` with the name of your project directory.
- Replace username - emilys password - emilyspass

# .env file - VITE_API_PREFIX=https://dummyjson.com
 
