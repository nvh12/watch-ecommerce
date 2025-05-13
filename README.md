# Watch E-Commerce Platform

A modern e-commerce platform for selling watches, built with a responsive design and secure architecture.

## Features

- **Browse & Search**: Explore watches with search and filter options.
- **Authentication**: Secure login and registration.
- **Shopping Cart**: Add, view, and purchase products.
- **Responsive Design**: Optimized for all devices.

## Tech Stack

### Front End
- **React** with **TailwindCSS** for responsive UI.
- **Fetch API** for client-server communication.

### Back End
- **Express** for server-side logic.
- **MongoDB** for database.
- **JWT** for authentication.
- **bcrypt** for password hashing.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nvh12/watch-ecommerce.git
   cd watch-ecommerce
   ```

2. Set up the **client**:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Runs on `http://localhost:3000`.

3. Set up the **server**:
   ```bash
   cd ../server
   npm install
   # Add a `.env` file with necessary variables (e.g., DB connection strings, JWT secret)
   npm run dev
   ```
   Runs on `http://localhost:5000`.

Ensure both client and server are running simultaneously for full functionality.
