# PaperCraft AI

**AI-powered examination paper digitization and generation platform.**

PaperCraft AI is a backend application designed to help schools and teachers digitize handwritten examination papers using AI. It extracts questions and examination details from uploaded images and stores the structured data for future paper generation.

The project aims to simplify the process of creating well-formatted, editable examination papers in Word and PDF formats.

## Features

### Implemented

- **User Registration:** Register users with securely hashed passwords using bcrypt.
- **User Login:** Authenticate users using email and password.
- **JWT Authentication:** Generate and verify JSON Web Tokens for protected API routes.
- **Image Upload:** Upload handwritten examination paper images using Multer.
- **AI-powered OCR:** Use Google's Gemini API to extract examination content from uploaded images.
- **Structured Data Extraction:** Extract subject name, instructions, sections, question numbers, question text and marks.
- **MongoDB Integration:** Store extracted examination data and associate each paper with its authenticated user.

### Planned

- Generate examination papers using the `docx` npm package.
- Implement a fixed school-specific examination paper template.
- Generate editable Word documents (`.docx`).
- Generate printable PDF documents.
- Allow users to retrieve and manage their generated papers.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| Google Gemini API | AI-powered OCR and data extraction |
| Multer | Image upload handling |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| dotenv | Environment variable management |

## Installation and Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd PaperCraft-AI-Agent
```

### 2. Install dependencies

```bash
npm install
```

The application uses the following main packages:

```bash
npm install express mongoose bcryptjs multer jsonwebtoken dotenv @google/genai
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
GOOGLE_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
```

Use the MongoDB connection variable expected by your `db.js` file.

**Important:** Never commit your `.env` file or expose API keys and JWT secrets publicly.

### 4. Start the server

```bash
node mega.js
```

The backend runs on port `8000` by default.

## API Documentation

Base URL:

```text
http://localhost:8000
```

### 1. Health Check

**Endpoint:** `POST /`

Checks whether the API is running.

Response:

```json
{
  "message": "ok"
}
```

### 2. User Registration

**Endpoint:** `POST /register`

Registers a new user.

Request body:

```json
{
  "name": "Robin",
  "email": "robin@example.com",
  "password": "your_test_password"
}
```

The password is hashed using bcrypt before being stored in MongoDB.

### 3. User Login

**Endpoint:** `POST /login`

Authenticates an existing user and generates a JWT.

Request body:

```json
{
  "email": "robin@example.com",
  "password": "your_test_password"
}
```

Successful login returns an authentication token.

### 4. Paper Upload and AI Extraction

**Endpoint:** `POST /papers`

**Authentication:** Required (Bearer Token)

Uploads a handwritten examination paper image, extracts its contents using Gemini and stores the extracted JSON in MongoDB.

Request headers:

```text
Authorization: Bearer <your_jwt_token>
```

Request body:

- Select `form-data` in Postman.
- Key: `paper`
- Type: `File`
- Value: Select an examination paper image.

**Upload restrictions:**

- Maximum file size: 5 MB.
- Currently accepts image MIME types.

The OCR process extracts:

- Subject name
- Examination instructions
- Sections
- Question numbers
- Complete question text
- Marks assigned to questions

Example of the expected extracted JSON structure:

```json
{
  "subject": "English",
  "instructions": [
    "Read each question carefully."
  ],
  "sections": [
    {
      "sectionName": "Multiple Choice",
      "questions": [
        {
          "questionNumber": 1,
          "questionText": "Example question?",
          "marks": 1
        }
      ]
    }
  ]
}
```

The extracted data is stored in MongoDB along with the authenticated user's ID.

### 5. Paper Test Route

**Endpoint:** `POST /paper-test`

A basic route used to verify paper-related API connectivity.

## Authentication Workflow

PaperCraft AI uses JWT-based authentication.

1. A user registers with their name, email and password.
2. The password is hashed before database storage.
3. The user logs in with their credentials.
4. The server verifies the password and generates a JWT.
5. The client sends the token in the Authorization header for protected requests.
6. Authentication middleware verifies the token and attaches the authenticated user's ID to `req.user`.
7. Protected routes use this ID to associate uploaded papers with their respective users.

## Paper Processing Workflow

```text
User Registration
       |
       v
User Login
       |
       v
JWT Generation
       |
       v
Upload Handwritten Paper
       |
       v
JWT Authentication
       |
       v
Multer Image Processing
       |
       v
Gemini API - OCR Extraction
       |
       v
Structured JSON Response
       |
       v
MongoDB Storage
```

## Future Development

The next major development phase is examination paper generation.

The planned workflow is:

1. Obtain the final school examination paper template from the client.
2. Implement the template using the `docx` npm package.
3. Combine the template with the extracted examination data.
4. Generate editable Word documents.
5. Convert the generated documents into printable PDFs.

The goal is to maintain consistent fonts, spacing, question formatting and layout throughout multi-page examination papers.

---

**Project Status:** Backend authentication, image upload, AI-powered extraction and MongoDB storage are implemented. Document generation is planned for the next development phase.