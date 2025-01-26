Test API Locally
Before deploying, verify that the routes and controllers work locally:

Start your server: npm run dev

Test your endpoints: 
POST http://localhost:5000/api/users/register with 

body:{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

POST http://localhost:5000/api/users/login with body:
{
  "email": "john@example.com",
  "password": "password123"
}
3. Environment Variables
Add the following variables to your Vercel project:

MONGO_URI – Your MongoDB connection string.
JWT_SECRET – A random secret key (e.g., supersecretkey).
Any other variables required in your application.
