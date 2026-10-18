# Database Migration
- A database migration is a version-controlled script that creats or changes your database structure.
- For example, in Day 18 we worked on PostgreSQL CRUD APIs. Our application may need a tasks table with these columns:- id, title, completed, created_st
- Instead of manually created this table every time, we write a migration script and execute it whenever the application needs the schema.

## Migration v/s Seeding
### Migration(`migrate.js`)
- Create or update databse structures such as tables, columns, indexes and constraints.

### Seeding (`seed.js`)
- Insert predicatbl sample data so we can test our application without entering records manually.
