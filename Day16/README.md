# QUESRIES 
### CREATE users TABLE
```
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL
);
```
### CREATE tasks TABLE

```
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    user_id INTEGER REFERENCES users(id)
);
```

### INSERT DATA

```
INSERT INTO users (name, email)
VALUES
    ('Aman', 'aman@example.com'),
    ('Priya', 'priya@example.com'),
    ('Rahul', 'rahul@example.com');


INSERT INTO tasks (title, completed, user_id)
VALUES
    ('Learn SQL', TRUE, 1),
    ('Build REST API', FALSE, 1),
    ('Practice PostgreSQL', FALSE, 2),
    ('Learn Node.js', TRUE, 3),
    ('Build a backend project', FALSE, 2);

```

### READ DATA FORM users and tasks TABLE
```
SELECT * FROM users;
SELECT * FROM tasks;
```

### UPDATE 
```
UPDATE tasks
SET completed = TRUE
WHERE id = 2;
```

###  DELETE ITEMS
```
DELETE FROM tasks
WHERE id = 3;

```
### `WHERE` CLAUSE
```
SELECT *
FROM tasks
WHERE completed = TRUE;


SELECT *
FROM tasks
WHERE completed = FALSE;

SELECT *
FROM tasks
WHERE user_id = 1;

```


### Both conditions must be true
```
SELECT *
FROM tasks
WHERE completed = FALSE
  AND user_id = 1;
```
### Either condition can be true
```
SELECT *
FROM tasks
WHERE user_id = 1
```
### IN - Match multiple values
```
SELECT *
FROM tasks
WHERE user_id IN (1, 2, 3);
```

- LIKE and ILIKE - Search text
-  Use LIKE to match a text pattern. PostgreSQL's ILIKE performs case-insensitive matching.
- Titles starting with "Learn"
```
SELECT *
FROM tasks
WHERE title LIKE 'Learn%';
```
## Titles containing "backend", regardless of case
```
SELECT *
FROM tasks
WHERE title ILIKE '%backend%';
   OR user_id = 2;
```

- ORDER BY - Sort Records
- Sort by ID, smallest first
```
SELECT *
FROM tasks
ORDER BY id ASC;
```
## Sort by ID, largest first
```
SELECT *
FROM tasks
ORDER BY id DESC;

SELECT *
FROM tasks
ORDER BY completed ASC, id DESC;
```
### PAGINATION
- LIMIT and OFFSET - Pagination
- Return the first 2 tasks
```
SELECT *
FROM tasks
ORDER BY id ASC
LIMIT 2;
```

- Skip the first 2 tasks and return the next 2
```
SELECT *
FROM tasks
ORDER BY id ASC
LIMIT 2 OFFSET 2;
```
### COUNT() - count records
```
SELECT COUNT(*) AS total_tasks
FROM tasks;

SELECT COUNT(*) AS completed_tasks
FROM tasks
WHERE completed = TRUE;

SELECT
    COUNT(*) AS total_rows,
    COUNT(user_id) AS tasks_with_user
FROM tasks;

SELECT COUNT(DISTINCT user_id) AS users_with_tasks
FROM tasks;

```

### AVG() - Calculate the average
```
SELECT AVG(price) AS average_price
FROM products;

SELECT AVG(marks) AS average_marks
FROM students;
```
### GROUP BY - Group records and calculate statustics
```
SELECT
    user_id,
    COUNT(*) AS total_tasks
FROM tasks
GROUP BY user_id;
```
- HAVING vs WHERE
- These clauses are related but serve different purposes.
  - WHERE filters individual rows before grouping.
  - HAVING filters groups after aggregation.

```
SELECT
    user_id,
    COUNT(*) AS total_tasks
FROM tasks
GROUP BY user_id
HAVING COUNT(*) > 1;
```