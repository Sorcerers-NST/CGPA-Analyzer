# Semester API Documentation

## Overview
Complete REST API for managing semesters in the CGPA Analyzer application. All routes are protected with JWT authentication.

## Base URL
```
http://localhost:3000/api/v1/semesters
```

## Authentication
All requests require a valid JWT token in cookies. Ensure you're logged in before making requests.

---

## Endpoints

### 1. Create Semester
**POST** `/api/v1/semesters/`

Create a new semester for the logged-in user.

**Request Body:**
```json
{
  "semesterNumber": 1,
  "startDate": "2024-01-15",  // Optional
  "endDate": "2024-05-30"     // Optional
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "semesterNumber": 1,
    "userId": "123",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-05-30T00:00:00.000Z",
    "createdAt": "2024-11-12T10:30:00.000Z",
    "updatedAt": "2024-11-12T10:30:00.000Z",
    "subjects": []
  },
  "message": "Semester created successfully"
}
```

**Error Response (409):**
```json
{
  "success": false,
  "error": "Semester already exists for this user"
}
```

---

### 2. Get All Semesters
**GET** `/api/v1/semesters/`

Retrieve all semesters for the logged-in user with their subjects.

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "semesterNumber": 1,
      "userId": "123",
      "startDate": "2024-01-15T00:00:00.000Z",
      "endDate": "2024-05-30T00:00:00.000Z",
      "createdAt": "2024-11-12T10:30:00.000Z",
      "updatedAt": "2024-11-12T10:30:00.000Z",
      "subjects": [
        {
          "id": "1",
          "name": "Mathematics",
          "credits": 4.0,
          "grade": "A",
          "gradePoint": 9.0,
          "semesterId": "1"
        }
      ]
    }
  ],
  "count": 1
}
```

---

### 3. Get Semester by ID
**GET** `/api/v1/semesters/:id`

Get detailed information about a specific semester including all subjects.

**URL Parameters:**
- `id` - Semester ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "semesterNumber": 1,
    "userId": "123",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-05-30T00:00:00.000Z",
    "createdAt": "2024-11-12T10:30:00.000Z",
    "updatedAt": "2024-11-12T10:30:00.000Z",
    "subjects": [
      {
        "id": "1",
        "name": "Mathematics",
        "credits": 4.0,
        "grade": "A",
        "gradePoint": 9.0,
        "semesterId": "1"
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Semester not found"
}
```

---

### 4. Update Semester
**PUT** `/api/v1/semesters/:id`

Update semester information (number, dates, etc.).

**URL Parameters:**
- `id` - Semester ID

**Request Body (all fields optional):**
```json
{
  "semesterNumber": 2,
  "startDate": "2024-06-01",
  "endDate": "2024-10-30"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "semesterNumber": 2,
    "userId": "123",
    "startDate": "2024-06-01T00:00:00.000Z",
    "endDate": "2024-10-30T00:00:00.000Z",
    "createdAt": "2024-11-12T10:30:00.000Z",
    "updatedAt": "2024-11-12T11:00:00.000Z",
    "subjects": []
  },
  "message": "Semester updated successfully"
}
```

**Error Responses:**
- 404: Semester not found
- 409: Semester number already exists for this user

---

### 5. Delete Semester
**DELETE** `/api/v1/semesters/:id`

Delete a semester and all its related data (subjects, CGPA records, leaderboard entries).

**URL Parameters:**
- `id` - Semester ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Semester and all related data deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Semester not found"
}
```

---

### 6. Calculate Semester CGPA/SGPA
**GET** `/api/v1/semesters/:id/cgpa`

Calculate the SGPA (Semester Grade Point Average) based on subjects' grade points and credits.

**URL Parameters:**
- `id` - Semester ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "semesterId": "1",
    "semesterNumber": 1,
    "sgpa": 8.75,
    "totalCredits": 20.0,
    "totalSubjects": 5,
    "completedSubjects": 5,
    "subjects": [
      {
        "name": "Mathematics",
        "credits": 4.0,
        "grade": "A",
        "gradePoint": 9.0
      },
      {
        "name": "Physics",
        "credits": 4.0,
        "grade": "A-",
        "gradePoint": 8.5
      }
    ]
  }
}
```

**Response when no grades available:**
```json
{
  "success": true,
  "data": {
    "semesterId": "1",
    "sgpa": 0,
    "totalCredits": 0,
    "totalSubjects": 3,
    "completedSubjects": 0,
    "message": "No completed subjects with grades"
  }
}
```

---

## Testing with Postman

### Setup
1. Start the server: `npm run dev`
2. Ensure you have a valid JWT token (login first)
3. The token should be automatically set in cookies

### Test Sequence

1. **Create Semester 1**
   ```
   POST http://localhost:3000/api/v1/semesters/
   Body: { "semesterNumber": 1 }
   ```

2. **Create Semester 2**
   ```
   POST http://localhost:3000/api/v1/semesters/
   Body: { "semesterNumber": 2, "startDate": "2024-06-01" }
   ```

3. **Get All Semesters**
   ```
   GET http://localhost:3000/api/v1/semesters/
   ```

4. **Get Specific Semester**
   ```
   GET http://localhost:3000/api/v1/semesters/1
   ```

5. **Update Semester**
   ```
   PUT http://localhost:3000/api/v1/semesters/1
   Body: { "endDate": "2024-05-30" }
   ```

6. **Calculate CGPA** (after adding subjects with grades)
   ```
   GET http://localhost:3000/api/v1/semesters/1/cgpa
   ```

7. **Delete Semester**
   ```
   DELETE http://localhost:3000/api/v1/semesters/1
   ```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no/invalid token)
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Server Error

---

## Notes

1. **BigInt Handling**: Semester IDs and User IDs are stored as BigInt in PostgreSQL
2. **Authorization**: Users can only access/modify their own semesters
3. **Cascade Delete**: Deleting a semester removes all subjects, CGPA records, and leaderboard entries
4. **SGPA Calculation**: Only includes subjects with assigned grade points
5. **Date Format**: Dates should be in ISO 8601 format (YYYY-MM-DD)

---

## Integration with Frontend

The frontend should call these endpoints with credentials enabled:

```javascript
// Example fetch call
fetch('http://localhost:3000/api/v1/semesters/', {
  method: 'GET',
  credentials: 'include', // Important for cookies
  headers: {
    'Content-Type': 'application/json'
  }
})
```

---

## Architecture

```
Route (semester.routes.js)
  ↓
Controller (semester.controller.js)
  ↓
Service (semester.service.js)
  ↓
Prisma Client (database)
```

Each layer has a specific responsibility:
- **Routes**: Define endpoints and apply middleware
- **Controllers**: Handle HTTP requests/responses and validation
- **Services**: Contain business logic and Prisma queries
- **Prisma**: Database ORM for PostgreSQL operations
