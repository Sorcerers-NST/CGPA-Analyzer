# Semester API - Quick Reference Card

## 🚀 Quick Start

1. **Start Server**: `npm run dev` (in server directory)
2. **Login**: Get JWT token (use existing auth endpoints)
3. **Base URL**: `http://localhost:3000/api/v1/semesters`

---

## 📍 Endpoints Cheat Sheet

```bash
# 1. CREATE SEMESTER
POST /api/v1/semesters/
Body: { "semesterNumber": 1, "startDate": "2024-01-15", "endDate": "2024-05-30" }

# 2. GET ALL SEMESTERS
GET /api/v1/semesters/

# 3. GET SPECIFIC SEMESTER
GET /api/v1/semesters/1

# 4. UPDATE SEMESTER
PUT /api/v1/semesters/1
Body: { "semesterNumber": 2, "startDate": "2024-06-01" }

# 5. DELETE SEMESTER
DELETE /api/v1/semesters/1

# 6. CALCULATE CGPA
GET /api/v1/semesters/1/cgpa
```

---

## 🔧 cURL Commands (Copy & Paste)

```bash
# Login first to get JWT token
# Then use these commands:

# Create Semester
curl -X POST http://localhost:3000/api/v1/semesters/ \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"semesterNumber": 1, "startDate": "2024-01-15"}'

# Get All Semesters
curl -X GET http://localhost:3000/api/v1/semesters/ \
  -b cookies.txt

# Get Semester by ID
curl -X GET http://localhost:3000/api/v1/semesters/1 \
  -b cookies.txt

# Update Semester
curl -X PUT http://localhost:3000/api/v1/semesters/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"semesterNumber": 2}'

# Calculate CGPA
curl -X GET http://localhost:3000/api/v1/semesters/1/cgpa \
  -b cookies.txt

# Delete Semester
curl -X DELETE http://localhost:3000/api/v1/semesters/1 \
  -b cookies.txt
```

---

## 📦 Request Body Examples

### Create/Update Semester
```json
{
  "semesterNumber": 1,      // Required for create, optional for update
  "startDate": "2024-01-15", // Optional (ISO 8601 format)
  "endDate": "2024-05-30"    // Optional (ISO 8601 format)
}
```

---

## ✅ Success Response Examples

### Create/Get/Update
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
  }
}
```

### Delete
```json
{
  "success": true,
  "message": "Semester and all related data deleted successfully"
}
```

### Calculate CGPA
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
    "subjects": [...]
  }
}
```

---

## ❌ Error Response Examples

### 400 - Bad Request
```json
{
  "success": false,
  "error": "Semester number is required"
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "error": "Access Denied. No token provided."
}
```

### 404 - Not Found
```json
{
  "success": false,
  "error": "Semester not found"
}
```

### 409 - Conflict
```json
{
  "success": false,
  "error": "Semester already exists for this user"
}
```

---

## 🧪 Test Sequence

```
1. Login → Get JWT token
2. Create Semester 1
3. Create Semester 2
4. Get all semesters (should show 2)
5. Get semester 1 details
6. Update semester 1
7. Add subjects to semester 1
8. Calculate CGPA for semester 1
9. Delete semester 2
10. Verify semester 2 is gone
```

---

## 🎯 Key Points to Remember

✅ All routes require JWT authentication  
✅ Users can only access their own semesters  
✅ Semester numbers must be unique per user  
✅ Deleting a semester deletes all subjects  
✅ CGPA only includes subjects with grades  
✅ BigInt IDs are returned as strings  

---

## 🔍 Debugging Tips

**Check if server is running:**
```bash
curl http://localhost:3000/api/v1/semesters/
```

**Check JWT token:**
- Look in browser DevTools → Application → Cookies
- Cookie name: `jwt`
- Should be set after login

**Common Issues:**
- 401 error → Login again
- 404 error → Check semester ID
- 409 error → Semester number already exists

---

## 📱 Frontend Integration Snippet

```javascript
// Create semester
const createSemester = async (semesterNumber) => {
  const res = await fetch('http://localhost:3000/api/v1/semesters/', {
    method: 'POST',
    credentials: 'include', // IMPORTANT: Include cookies
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ semesterNumber })
  });
  return res.json();
};

// Get all semesters
const getSemesters = async () => {
  const res = await fetch('http://localhost:3000/api/v1/semesters/', {
    credentials: 'include'
  });
  const data = await res.json();
  return data.data; // Array of semesters
};

// Calculate CGPA
const getCGPA = async (semesterId) => {
  const res = await fetch(
    `http://localhost:3000/api/v1/semesters/${semesterId}/cgpa`,
    { credentials: 'include' }
  );
  const data = await res.json();
  return data.data.sgpa; // 8.75
};
```

---

## 📊 Status Codes Reference

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Missing/invalid data |
| 401 | Unauthorized | No/invalid JWT token |
| 404 | Not Found | Semester doesn't exist |
| 409 | Conflict | Duplicate semester number |
| 500 | Server Error | Unexpected error |

---

## 🗂️ Related Files

- **Documentation**: `SEMESTER_API_DOCS.md`
- **Implementation Details**: `IMPLEMENTATION_SUMMARY.md`
- **Architecture Guide**: `FILE_STRUCTURE_GUIDE.md`
- **Postman Collection**: `Semester_API.postman_collection.json`

---

## 🎓 CGPA Calculation Formula

```
SGPA = Σ(gradePoint × credits) / Σ(credits)

Example:
Math: A (9.0) × 4 credits = 36
Physics: B (8.0) × 3 credits = 24
Chem: A- (8.5) × 2 credits = 17
Total = 77 / 9 = 8.56 SGPA
```

---

## ⚡ Quick Commands

```bash
# Start server
cd server && npm run dev

# Check database
npx prisma studio

# View logs
# (Server console shows all requests)

# Stop server
Ctrl + C
```

---

## 🎯 Success Criteria

✅ Server running on port 3000  
✅ Can create semester  
✅ Can retrieve semesters  
✅ Can update semester  
✅ Can delete semester  
✅ Can calculate CGPA  
✅ Authorization working  
✅ Errors handled properly  

---

**Ready to test? Start with:** `POST /api/v1/semesters/` 🚀
