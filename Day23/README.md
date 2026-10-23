### To generate user token and admin token 
- Open second terminal and run node src/tests/generateToken.js

### public route
- GET 5000/api/public (no token needed)

### profile without token
- GET 5000/api/profile (Unauthorized)

### profile with user token
GET 5000/api/profile (bearer token, then paste user token)

### user tries admin dasshboard
GET 5000/api/admin/dashboard (403 Forbidded)

### Admin accesss daashboard
GET 5000/api/admin/dashboard (200 OK)

### supertest
- to run the security tests 
add npm pkg set scripts.test="node --test src/tests/*.test.js" script to package.json