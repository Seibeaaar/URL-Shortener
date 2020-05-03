const express = require('express');
const config = require('config');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

app.use(express.json({ extended: true }))

const PORT = config.get('port') || 5000;

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/link', require('./routes/linkRoutes'));
app.use('/t', require('./routes/redirectRoutes'));

if(process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

async function start() {
  try {
    await mongoose.connect(config.get('mongoURL'), {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    })
  } catch(e) {
    console.log("Server error", e.message);
    process.exit(1);
  }
}

start();

app.listen(PORT, () => console.log('test'));