### API TESTING

- POST 5000/api/auth/register
{
  "name": "Yash",
  "email": "yash@example.com",
  "password": "Secure123"
}

- TEST - invalid request

{
  "name": "",
  "email": "wrong-email",
  "password": "123"
}

- TEST - Sanitization

{
  "name": "  Yash  ",
  "email": "  yash@example.com  ",
  "password": "Secure123"
}

- POST 5000/api/tasks
- TEST - Valid input
{
  "title": "Complete Day 24",
  "description": "Practice Zod validation",
  "priority": 3,
  "estimatedHours": 2
}


- TEST - Invalid Priority
{
  "title": "Complete Day 24",
  "priority": 8
}

- TEST - Invalid numeric type
{
  "title": "Complete Day 24",
  "priority": "3"
}

- TEST - Missing title
{
  "priority": 3
}