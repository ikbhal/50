const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');

const app = express();
const port = 3025;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));
app.use('/static', express.static('public'));

// Setup express-session and connect-flash
app.use(session({
  secret: 'muhammed',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Create 'goals.json' if it doesn't exist
const goalsFilePath = path.join(__dirname, 'goals.json');
if (!fs.existsSync(goalsFilePath)) {
  fs.writeFileSync(goalsFilePath, '[]');
}

app.post('/add-goal', (req, res) => {
  const { goal } = req.body;

  // Read existing goals from JSON file
  let goals = JSON.parse(fs.readFileSync(goalsFilePath, 'utf8'));

  // Add the new goal to the list
  goals.push({ text: goal, date: new Date().toISOString() });

  // Update the JSON file with the new goals
  fs.writeFileSync(goalsFilePath, JSON.stringify(goals, null, 2));

  req.flash('success', 'Goal added successfully.');
  res.redirect('/');
});

app.post('/toggle-goal', (req, res) => {
  const { goalId } = req.body;

  // Read existing goals from JSON file
  let goals = JSON.parse(fs.readFileSync(goalsFilePath, 'utf8'));

  // Check if the goalId is within valid range
  if (goalId >= 0 && goalId < goals.length) {
    // Toggle the completion status of the goal using square brackets
    // Assume 'completed' is false if it doesn't exist
    goals[goalId]['completed '] = goals[goalId]['completed '] === undefined ? true : !goals[goalId]['completed '];
  } else {
    // Handle invalid goalId
    req.flash('error', 'Invalid goal ID.');
  }

  // Update the JSON file with the updated goals
  fs.writeFileSync(goalsFilePath, JSON.stringify(goals, null, 2));

  req.flash('success', 'Goal status updated successfully.');
  res.redirect('/');
});

app.get('/', (req, res) => {
  // Read goals from JSON file
  const goals = JSON.parse(fs.readFileSync(goalsFilePath, 'utf8'));

  // Render the EJS template and pass the goals and flash messages as data
  res.render('index', { goals, messages: req.flash('success') });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
