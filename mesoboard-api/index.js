const express = require('express');
const cors = require('cors');
const path = require('path');
// const db = require('./db')

// routes
const usersRouter = require('./routes/users')


const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET', 'POST', 'PUT', 'DELETE');
  next();
})


// Handle GET requests to /api route

app.use("/api", usersRouter);

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../mesoboard-app/build')));

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../mesoboard-app/build', 'index.html'));
});


try {
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
} catch (err) {
  console.error(err)
}
