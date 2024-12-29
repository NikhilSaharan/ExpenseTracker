// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();  // Import dotenv to use the .env variables

// Initialize express app
const app = express();

// Middleware
app.use(cors());  // Enable CORS for all origins (you can configure it more specifically if needed)
app.use(bodyParser.json()); // Parse JSON bodies

// MySQL connection using environment variables
const db = mysql.createConnection({
    host: process.env.DB_HOST,  // Use the value from the .env file
    user: process.env.DB_USER,  // Use the value from the .env file
    password: process.env.DB_PASSWORD,  // Use the value from the .env file
    database: process.env.DB_DATABASE  // Use the value from the .env file
});

// Connect to MySQL database
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Endpoint to add expense
app.post('/addExpense', (req, res) => {
    const { expenseName, amount, category, date } = req.body;

    // Validate input
    if (!expenseName || !amount || !category || !date) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Insert into database
    const query = 'INSERT INTO expenses (expense_name, amount, category, date) VALUES (?, ?, ?, ?)';
    db.query(query, [expenseName, amount, category, date], (err, result) => {
        if (err) {
            console.error('Error while adding expense:', err);
            return res.status(500).json({ error: 'Failed to add expense' });
        }
        res.status(200).json({ message: 'Expense added successfully' });
    });
});

// Endpoint to get all expenses
app.get('/getExpenses', (req, res) => {
    const query = 'SELECT * FROM expenses';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error while fetching expenses:', err);
            return res.status(500).json({ error: 'Failed to fetch expenses' });
        }
        res.status(200).json(result);
    });
});

// Endpoint to update an expense
app.put('/updateExpense', (req, res) => {
    const { id, expenseName, amount, category, date } = req.body;

    // Validate input
    if (!id || !expenseName || !amount || !category || !date) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Update the expense in the database
    const query = 'UPDATE expenses SET expense_name = ?, amount = ?, category = ?, date = ? WHERE id = ?';
    db.query(query, [expenseName, amount, category, date, id], (err, result) => {
        if (err) {
            console.error('Error while updating expense:', err);
            return res.status(500).json({ error: 'Failed to update expense' });
        }
        res.status(200).json({ message: 'Expense updated successfully' });
    });
});

// Endpoint to delete an expense
app.delete('/deleteExpense', (req, res) => {
    const { id } = req.body;

    // Validate input
    if (!id) {
        return res.status(400).json({ error: 'Expense ID is required' });
    }

    // Delete the expense from the database
    const query = 'DELETE FROM expenses WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error while deleting expense:', err);
            return res.status(500).json({ error: 'Failed to delete expense' });
        }
        res.status(200).json({ message: 'Expense deleted successfully' });
    });
});

// Start the server
const port = process.env.PORT || 5000; // Use the PORT from the .env file or fallback to 5000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
