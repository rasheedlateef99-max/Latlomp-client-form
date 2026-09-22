const bcrypt = require('bcrypt');

async function verifyPassword(inputPassword) {
  const hash = process.env.MASTER_ADMIN_PASSWORD_HASH;
  const plain = process.env.MASTER_ADMIN_PASSWORD;

  if (hash) {
    return bcrypt.compare(inputPassword, hash);
  }

  if (plain) {
    return inputPassword === plain;
  }

  // Neither configured — no login is possible until .env is set up
  return false;
}

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const validUsername = username === process.env.MASTER_ADMIN_USERNAME;
  const validPassword = validUsername ? await verifyPassword(password) : false;

  if (!validUsername || !validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  req.session.isMasterAdmin = true;
  res.json({ message: 'Master admin logged in' });
}

function logout(req, res) {
  req.session.isMasterAdmin = false;
  res.json({ message: 'Master admin logged out' });
}

function getStatus(req, res) {
  res.json({ isMasterAdmin: !!req.session.isMasterAdmin });
}

module.exports = { login, logout, getStatus };