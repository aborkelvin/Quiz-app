# IQ Quiz - Backend

IQ Quiz is a full-stack web application that allows users to create, take, and manage quizzes. This repository contains the backend of the application, built using Node.js and Express.

## Features

- User authentication and authorization using JWT
- Quiz creation and management
- Taking quizzes and storing results
- Image upload support using Multer and Cloudinary
- Secure password hashing with bcryptjs
- API documentation using Swagger

## Technologies Used

- **Node.js & Express** - Backend framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT (jsonwebtoken)** - Authentication
- **Cloudinary & Multer** - Image upload handling
- **Nodemailer** - Email notifications
- **Swagger** - API documentation
- **dotenv** - Environment variable management

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/aborkelvin/Quiz-app.git
   ```
2. Navigate to the project directory:
   ```sh
   cd Quiz-app
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Create a `.env` file and configure the required environment variables:
   ```sh
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
5. Start the server:
   ```sh
   npm start
   ```
   For development:
   ```sh
   npm run start:dev
   ```

## API Documentation

Swagger documentation is available. Run the server and visit:

```
http://localhost:PORT/api-docs
```

## Contributing

Feel free to fork this repository and submit pull requests. Contributions are welcome!

## License

This project is licensed under the ISC License.

## Author

[Anthony Abor](https://github.com/aborkelvin/)
