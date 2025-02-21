# Book Management System

This project is a **Book Management System** built with **Node.js**, **Sequelize ORM**, and **MySQL**. It provides an API to manage books and authors with basic CRUD operations as well as pagination support for fetching books.

## Features

### Author Operations:
- **`createAuthor`**: Create a new author.
- **`getAllAuthors`**: Get a list of all authors.
- **`getAuthorById`**: Get details of an author by ID.
- **`updateAuthor`**: Update an existing author's details.
- **`deleteAuthor`**: Delete an author.

### Book Operations:
- **`addBook`**: Add a new book to the system.
- **`getAllBooks`**: Fetch a list of all books.
- **`getBookById`**: Get details of a specific book by its ID.
- **`updateBook`**: Update the information of an existing book.
- **`deleteBook`**: Delete a book from the system.
- **`getPaginatedBooks`**: Fetch books with pagination (limit and offset).

## Technologies Used
- **Node.js**: JavaScript runtime for the server-side code.
- **Sequelize**: ORM (Object-Relational Mapping) for interacting with MySQL database.
- **MySQL**: Relational database to store authors and book data.
- **Express.js**: Web framework for building the API.

## Installation

### Prerequisites:
- **Node.js**: Make sure Node.js is installed on your machine. You can download it from [here](https://nodejs.org/).
- **MySQL**: MySQL must be installed and running on your machine.

### Steps to Install:
1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/yourusername/book-management-system.git

2. change directory:
    ```bash
    cd book-management-system
3. Set up your .env file:

    ```bash
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=book_management

4. Start server:
    ```bash
    npm start

