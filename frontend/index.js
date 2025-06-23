const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello from Frontend!');
});

app.listen(PORT, () => {
  console.log(`Frontend listening on port ${PORT} : http://localhost:3000`);
});
