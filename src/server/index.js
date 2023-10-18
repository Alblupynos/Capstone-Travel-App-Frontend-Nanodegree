const app = require('./app')
const port = 8000;

// Setup Server
app.listen(port, () => {
    console.log(`Running server on port ${port}`);
});