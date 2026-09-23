require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const connectDB = require('./config/db');
const statusRoutes = require('./routes/statusRoutes');
const authRoutes = require('./routes/authRoutes');
const masterAdminAuthRoutes = require('./routes/masterAdminAuthRoutes');
const masterAdminRoutes = require('./routes/masterAdminRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const formRoutes = require('./routes/formRoutes');
const publicFormRoutes = require('./routes/publicFormRoutes');
const projectRoutes = require('./routes/projectRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const mySubmissionsRoutes = require('./routes/mySubmissionsRoutes');
const pageRoutes = require('./routes/pageRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const passport = require('./config/passport');

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
require('./models/Notification');

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', statusRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/master-admin/auth', masterAdminAuthRoutes);
app.use('/api/master-admin', masterAdminRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/public-forms', publicFormRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/my-submissions', mySubmissionsRoutes);
app.use(pageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`LatLomp server running on http://localhost:${PORT}`);
});