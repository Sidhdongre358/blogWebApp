# BlogWebApp

## Description

BlogApp is a full-stack web application where users can register, log in, post photo blogs, and add comments. This app leverages modern technologies and follows best practices to ensure scalability and maintainability.

## Features

- User Authentication (Register/Login)
- Post photo blogs
- Add comments on blogs
- Cloudinary integration for image uploads
- Secure password storage with bcrypt
- Session management

## Technologies Used

- Backend: Node.js, Express.js, MongoDB, Mongoose
- Frontend: EJS (Embedded JavaScript)
- Middleware: Multer, Cloudinary, Express-Session, Method-Override
- Authentication: Bcrypt
- Environment Variables: Dotenv

## Installation

1. Clone the repository
    ```sh
    git clone https://github.com/sidhdongre358/blogWebApp.git
    ```
    [Copy](javascript:void(0);)

2. Navigate to the project directory
    ```sh
    cd blogApp
    ```
    [Copy](javascript:void(0);)

3. Install the dependencies
    ```sh
    npm install
    ```
    [Copy](javascript:void(0);)

## Configuration

1. Create a `.env` file in the root directory and add the following environment variables:
    ```plaintext
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/blogwebApp
    SESSION_SECRET=your_session_secret
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```
    

2. Ensure that your MongoDB server is running.

## Usage

1. Start the server
    ```sh
    npm start
    ```
   

2. Open your browser and navigate to `http://localhost:3000`



