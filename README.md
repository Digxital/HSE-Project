# HSE Management Platform – MVP

## Overview

This project is an **AI-enabled HSE (Health, Safety & Environment) Management Platform** designed for the **oil & gas industry**, with an initial **internal deployment** followed by evolution into a **commercial multi-tenant SaaS product**.

The MVP focuses on:
- **Fast, offline-first frontline reporting**
- **Robust action tracking and verification**
- **Audit-ready data and workflows**
- **AI-assisted decision support (not enforcement)**

The system must work reliably in **low-connectivity, field-operating environments** and remain usable **with or without AI enabled**.

---

## Core Principles (Non-Negotiable)

- **Offline-first**: Mobile reporting must work without connectivity
- **Action-centric**: All modules feed into actions
- **AI assists, users decide**: AI is advisory, explainable, and overrideable
- **Audit-ready by design**: Full logs, traceability, soft deletes only
- **Multi-tenant from Day 1**
- **MVP discipline**: No scope expansion beyond defined workflows

---

## Target Users & Roles

Role-based access control (RBAC) is mandatory.

- Field Users (employees & contractors)
- Supervisors
- HSE Officers
- Operations Managers
- Executive / Senior Management
- External Client / Auditor (read-only, time-bound)

---

## MVP Functional Scope

### 1. Hazard & Observation Reporting (Mobile, Offline-First)

**Purpose:** Enable fast, low-friction frontline reporting.

**Key Requirements**
- Android-first mobile app
- Offline capture with background sync
- < 60 seconds to submit a report
- Media capture:
  - Photos
  - Optional video
  - Voice notes
- GPS location + timestamp
- Anonymous reporting option
- Sync status indicator

**Hazard Categories**
- Unsafe Act
- Unsafe Condition
- Near Miss
- Environmental Hazard
- Stop Work Authority (flag)

**AI-Assist (Mandatory)**
- Suggested hazard category
- Suggested severity level
- Voice-to-text transcription
- Duplicate detection (same location/time)

> All AI outputs must be user-confirmable and overrideable.

---

### 2. Incident Management (Web + Mobile)

**Purpose:** Capture and manage incidents with traceability and learning.

**Requirements**
- Incident classification:
  - First Aid
  - MTI
  - LTI
  - Environmental
  - Property Damage
- Severity logic
- Immediate actions
- Investigation summary
- Evidence attachments
- Linkage to corrective actions

**AI-Assist**
- Suggested incident classification
- Prompts for missing investigation elements
- Pattern recognition (informational only)

---

### 3. Action Tracking & Verification (System Backbone)

**Purpose:** Ensure findings lead to verified closure.

**Requirements**
- Central action register
- Action ownership assignment
- Due dates and escalation rules
- Evidence-based closure
- Verification step (Supervisor or HSE Officer)
- Overdue flagging

> All hazards, incidents, and inspections must feed into actions.

---

### 4. Inspections & Audits

**Purpose:** Planned and ad-hoc compliance checks.

**Requirements**
- Template-based checklists
- Office, site, and vessel inspections
- Findings linked to actions
- Photo evidence
- Full audit trail

**AI (Optional in MVP)**
- Suggested focus areas based on trends
- Recurring finding identification

---

### 5. Dashboards & Management Insight (Web)

**Purpose:** Management visibility and decision support.

**Dashboards Must Include**
- Leading indicators:
  - Hazards
  - Observations
- Lagging indicators:
  - Incidents
  - LTIs
- Action closure rates
- High-risk locations and activities
- Contractor performance

**AI-Insight (Phase 2 – Not MVP)**
- Narrative summaries
- Trend and hotspot detection

**Exports**
- PDF
- Excel

---

## AI Implementation Rules

### AI Principles
- AI assists; humans decide
- No automated enforcement or disciplinary actions
- All AI outputs must be explainable
- Overrides must be logged
- Platform must function fully without AI

### AI Maturity Phases
- **Phase 1 (MVP):** AI-Assist only
- **Phase 2:** AI-Insight (post-pilot)
- **Phase 3:** AI-Predict (commercial phase)

---

## Architecture Overview

### Frontend
- Android Mobile App (offline-first)
- Web App (dashboards, actions, admin)

### Backend
- Modular backend services
- RESTful APIs
- Central Action Engine
- Multi-tenant core
- RBAC & audit logging

### Data Layer
- Relational database (core entities)
- Object storage for media
- Encrypted local storage on device (offline mode)

### AI Layer
- Decoupled, API-based AI services
- Tenant-isolated processing
- No cross-tenant learning
- No training on client data without consent

---

## Core Data Entities

- Organization (Tenant)
- User
- Location (Office / Site / Vessel)
- Event (Hazard / Observation / Incident)
- Action
- Inspection / Audit
- Attachment (Media)

**Logical Flow**

---

## Offline & Sync Requirements

- Local encrypted storage on device
- Background sync when connectivity resumes
- Sync status indicator
- Conflict resolution rules defined (last-write or server-authoritative)

---

## Security & Compliance

- Role-based access control
- Encrypted data at rest and in transit
- Full audit logs
- Soft deletes only
- Read-only, time-bound access for auditors

---

## MVP Acceptance Criteria

The MVP is accepted when:
- Offline reporting works reliably
- Actions can be verified and closed
- Dashboards reflect accurate data
- AI suggestions are explainable and overrideable
- Full audit trail exists for all actions

---

## Out of Scope (MVP)

- Predictive AI or automated risk scoring
- Commercial billing and subscriptions
- Advanced tenant branding
- Cross-tenant analytics
- AI-driven enforcement or alerts without human review

---

## Delivery Philosophy

- MVP-first
- Field realism over feature volume
- No scope creep without written approval
- Reliability > novelty

---

## License & Confidentiality

This project contains confidential information and is governed by client confidentiality agreements.


npm run login
npm run deploy
npx vercel dev