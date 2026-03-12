# Aegix Web Dashboard - Role-Based Access Proposal

## Background

The Aegix platform currently has an Admin Dashboard for system administrators. As we scale, we need to provide web access to other roles (Supervisor, HSE Officer) without creating entirely separate dashboards.

---

## Current Roles

| Role | Primary Function | Platform |
|------|------------------|----------|
| **Admin** | User management, full system oversight | Web Dashboard |
| **Supervisor** | Team oversight, action assignment | Web Dashboard (proposed) |
| **HSE Officer** | Compliance monitoring, analytics | Web Dashboard (proposed) |
| **Field User** | Report hazards/incidents via AI voice | Mobile App only |

---

## The Issue

Do we need to design and build **3 separate dashboard UIs** for Admin, Supervisor, and HSE Officer?

---

## Proposed Solution: Single Dashboard with Role-Based Access

**One dashboard, different visibility based on role.**

### How It Works

1. User logs in with email + password (via Microsoft 365 authentication)
2. Backend returns user data **including their assigned role**
3. Frontend displays/hides features based on that role

### Access Matrix

| Feature | Admin | Supervisor | HSE Officer |
|---------|:-----:|:----------:|:-----------:|
| Dashboard Overview | ✅ | ✅ | ✅ |
| Reports (View/Manage) | ✅ All | ✅ Team/Location | ✅ All |
| Actions (Assign/Track) | ✅ | ✅ | ✅ |
| Analytics | ✅ | ✅ Limited | ✅ Full |
| User Management | ✅ | ❌ | ❌ |
| Settings | ✅ | ❌ | ❌ |

### Security

- Role is **determined by backend**, not user-selected
- Admin assigns roles via User Management
- Users cannot impersonate other roles
- Protected routes prevent URL manipulation

---

## Benefits

1. **No additional design screens needed** - Same UI, conditionally rendered
2. **Faster development** - One codebase to maintain
3. **Consistent UX** - All web users get the same look & feel
4. **Easier onboarding** - Users familiar with the interface regardless of role
5. **Scalable** - Easy to add new roles or adjust permissions later

---

## What Changes in Current Build

| Component | Change |
|-----------|--------|
| Login Page | No change (email + password) |
| Sidebar | Hide menu items based on role (e.g., hide "Users" for non-Admin) |
| Pages | Conditionally filter data (e.g., Supervisor sees only their location's reports) |
| Routing | Add role-based route protection |

---

## Next Steps (Pending Approval)

1. ✅ Team Lead approval
2. Implement auth context to store user role
3. Update Sidebar with conditional menu items
4. Add route guards for protected pages
5. Backend team to include role in auth response

---

## Summary

No need for separate designs for Supervisor/HSE Officer dashboards. We use the existing Admin dashboard and conditionally show/hide features based on the authenticated user's role returned from the backend.

---

*Document created: March 6, 2026*
