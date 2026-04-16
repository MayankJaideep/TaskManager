TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{"username":"adminUser","password":"password123"}' | grep -o '\"token\":\"[^\"]*' | cut -d'\"' -f4)
curl -s -w "\nHTTP_CODE:%{http_code}\n" -X GET "http://localhost:8080/api/admin/tasks?page=0&size=20" -H "Authorization: Bearer $TOKEN"
