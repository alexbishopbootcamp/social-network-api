const express = require('express');
const app = express();
const routes = require('./routes');
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
