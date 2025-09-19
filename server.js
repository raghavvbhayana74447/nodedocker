const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from Jenkins Node.js App 🚀');
});

// Start server
app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
