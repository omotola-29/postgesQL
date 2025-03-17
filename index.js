const express = require('express');
const pg = require('pg');
const bcrypt = require('bcryptjs');
const app = express();
const port = 3500;

// Connect to the PostgreSQL database
const dbUrl = 'postgresql://localhost:5433/class2';
const db = new pg.Pool({
    host: 'localhost',
    database: 'class2',
    port: 5432,
    user: 'postgres',
    password: '781227',
    auth: true,
})

app.use(express.json());

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).send('Email and password are required');
        }
        // Check if user already exists
        const existingUser = await db.query(`SELECT * FROM admin WHERE email = $1`, [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).send('User already exists with that email');
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new User
         const newUser = await db.query(`INSERT INTO admin (name, email, password) VALUES ($1, $2, $3)`, [name, email, hashedPassword]);
        // Find existing user
        const user = await db.query(`SELECT * FROM admin WHERE email = $1`, [email]);
         // return users data in json
        return res.status(201).json({message: 'User created successfully', data: user.rows[0]});

    } catch (error) {
        console.log(error);
        return res.status(500).json('An error occurred while creating the user');
    }
})

// User Login

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json('Email and password are required');
        }
        const user = await db.query(`SELECT * FROM admin WHERE email = $1`, [email]);
        if (user.rows.length === 0) {
            return res.status(404).json('User not found');
        }
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json('Invalid password');
        }
        return res.status(200).json({message: 'Login successful', data: user.rows[0]});
    } catch (error) {
        console.log(error);
        return res.status(500).json('An error occurred while logging in');
    }
})












app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});




