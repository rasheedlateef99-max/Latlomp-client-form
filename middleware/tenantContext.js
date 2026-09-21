/**
 * Phase 2 placeholder — interface only.
 *
 * This does NOT perform real authentication or tenant authorization yet.
 * That arrives in the Authentication & Roles phase, once Google OAuth
 * and sessions exist.
 *
 * Once auth exists, this middleware will:
 *   1. Read the authenticated user from the session (req.user)
 *   2. Look up their active TenantMembership
 *   3. Attach the trusted tenant id as req.tenantId
 *   4. Reject the request if no valid membership exists
 *
 * It must NEVER trust a tenant id supplied by the client (body, query,
 * params, headers) for authorization decisions.
 */

function tenantContext(req, res, next) {
  // Not implemented yet — reserved for the Authentication & Roles phase.
  next();
}

module.exports = tenantContext;