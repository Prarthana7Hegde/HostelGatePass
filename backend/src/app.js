const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const passRoutes = require('./routes/passes');
const adminRoutes = require("./routes/admin");


require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/passes', passRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
// near other routes

app.use("/api/admin", adminRoutes);

module.exports = app;
