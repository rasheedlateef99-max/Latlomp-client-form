function validateEnv(env = process.env) {
  const errors = [];
  const warnings = [];

  if (env.NODE_ENV !== 'production') return { errors, warnings };

  const required = [
    'MONGODB_URI', 'SESSION_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CALLBACK_URL', 'CLIENT_URL', 'MASTER_ADMIN_USERNAME'
  ];
  required.forEach(key => {
    if (!env[key] || !env[key].trim()) errors.push(`${key} is not set`);
  });

  if (!env.MASTER_ADMIN_PASSWORD_HASH && !env.MASTER_ADMIN_PASSWORD) {
    errors.push('Set MASTER_ADMIN_PASSWORD_HASH (or MASTER_ADMIN_PASSWORD)');
  }
  if (env.SESSION_SECRET && env.SESSION_SECRET.length < 32) {
    errors.push('SESSION_SECRET must be at least 32 characters');
  }
  ['CLIENT_URL', 'GOOGLE_CALLBACK_URL'].forEach(key => {
    const v = env[key];
    if (v && (!v.startsWith('https://') || v.includes('localhost'))) {
      errors.push(`${key} must be a public https:// URL in production (not localhost)`);
    }
  });

  if (!env.MASTER_ADMIN_PASSWORD_HASH && env.MASTER_ADMIN_PASSWORD) {
    warnings.push('Master admin is using a plaintext password; prefer MASTER_ADMIN_PASSWORD_HASH');
  }
  if (!env.PAYSTACK_SECRET_KEY) {
    warnings.push('PAYSTACK_SECRET_KEY is not set; checkout and webhooks will not work');
  } else if (env.PAYSTACK_SECRET_KEY.startsWith('sk_test_')) {
    warnings.push('PAYSTACK_SECRET_KEY is a TEST key; no real money will be collected');
  }

  return { errors, warnings };
}

function assertEnv() {
  const { errors, warnings } = validateEnv();
  warnings.forEach(w => console.warn(`[env] warning: ${w}`));
  if (errors.length) {
    console.error('[env] Refusing to start. Fix these:');
    errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  }
}

module.exports = { validateEnv, assertEnv };