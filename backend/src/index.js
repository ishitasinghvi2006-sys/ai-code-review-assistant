const express = require('express');
const cors = require('cors');
const reviewRoutes = require('./routes/reviewRoutes');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS ||
  'http://localhost:5173,https://ai-code-review-assistant-ochre-ten.vercel.app')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'AI Code Review Assistant backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
