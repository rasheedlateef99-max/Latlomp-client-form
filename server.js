require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const connectDB = require('./config/db');
const statusRoutes = require('./routes/statusRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

connectDB();

// Phase 2: register core data models with Mongoose
require('./models/User');
require('./models/Tenant');
require('./models/TenantMembership');
require('./models/Form');
require('./models/Question');
require('./models/Project');
require('./models/ClientProfile');

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', statusRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`LatLomp server running on http://localhost:${PORT}`);
});