const express = require('express')
const { v4: uuidv4 } = require('uuid')
//const cors = require('cors')
const pool = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const axios = require('axios')

const PORT = process.env.SERVER_PORT ?? 8000

const app = express()
app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// signup
app.post('/api/v1/signup', async (req, res) => {
  try {
    const { email, password } = req.body    
    const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])

    // New user, so sign up
    if (!users.rows.length) {      
      const salt = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(password, salt)
      const signUp = await pool.query(`INSERT INTO users (email, hashed_password) VALUES($1, $2)`, [email, hashedPassword])
      const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' })
      res.status(200).json({ 'email': email, 'token': token })      
      // User already has an account, so login instead
    } else {
      res.redirect(307, '/api/v1/login')
    }
  } catch (err) {
    console.error(err)
    if (err) {
      res.status(409).json({ detail: err.detail })
    }
  }
})

// login
app.post('/api/v1/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (!users.rows.length) return res.status(409).json({ detail: `User [${email}] does not exist!` })
    const success = await bcrypt.compare(password, users.rows[0].hashed_password)
    const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' })
    if (success) {
      res.status(200).json({ 'email': users.rows[0].email, token })      
    } else {
      res.status(409).json({ detail: `Login failed [${password}]` })
    }
  } catch (err) {
    console.error(err)
  }
})

// get all todos
app.get('/api/v1/todos/:userEmail', async (req, res) => {
  try {
    const { userEmail } = req.params
    const todos = await pool.query('SELECT * FROM todos WHERE user_email = $1', [userEmail])
    res.status(200).json(todos.rows)
  } catch (err) {
    console.error(err)
  }
})

// create a new todo
app.post('/api/v1/todos', async (req, res) => {
  try {
    const { user_email, title, progress, date } = req.body
    const id = uuidv4()
    const newToDo = await pool.query(`INSERT INTO todos(id, user_email, title, progress, date) VALUES($1, $2, $3, $4, $5)`,
      [id, user_email, title, progress, date])
    res.status(200).json( {'id': id, 'email': user_email, 'title': title, 'progress': progress, 'date': date} )
  } catch (err) {
    console.error(err)
  }
})

// edit a new todo
app.put('/api/v1/todos/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { user_email, title, progress, date } = req.body
    const editToDo =
      await pool.query('UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id = $5;',
        [user_email, title, progress, date, id])
    res.status(200).json( {'id': id, 'email': user_email, 'title': title, 'progress': progress, 'date': date} )
  } catch (err) {
    console.error(err)
  }
})

// delete a todo
app.delete('/api/v1/todos/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deleteToDo = await pool.query('DELETE FROM todos WHERE id = $1;', [id])
    res.status(200).json( {'id': id} )
  } catch (err) {
    console.error(err)
  }
})

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))