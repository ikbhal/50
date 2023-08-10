const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const port = 3025;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Setup express-session and connect-flash
app.use(session({
  secret: 'muhammed',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.post('/add-goal', (req, res) => {
  const { goal } = req.body;

  // Read existing goals from JSON file
  let goals = JSON.parse(fs.readFileSync('goals.json', 'utf8'));

  // Add the new goal to the list
  goals.push({ text: goal, date: new Date().toISOString() });

  // Update the JSON file with the new goals
  fs.writeFileSync('goals.json', JSON.stringify(goals, null, 2));

  req.flash('success', 'Goal added successfully.');
  res.redirect('/');
});

app.get('/', (req, res) => {
  // Read goals from JSON file
  const goals = JSON.parse(fs.readFileSync('goals.json', 'utf8'));

  // Render the EJS template and pass the goals and flash messages as data
  res.render('index', { goals, messages: req.flash('success') });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
