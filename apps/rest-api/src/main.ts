import * as express from 'express';

// application
const app = express();

// serve
app.listen(process.env.SERVER_PORT, () => {
  console.log("Server started!");
});
