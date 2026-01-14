# HSE Management Platform - Web Demo Development Plan

## Design Guidelines

### Design References (Primary Inspiration)
- **Industrial Safety Platforms**: Clean, professional, data-focused
- **Enterprise Dashboards**: Clarity, hierarchy, actionable insights
- **Style**: Modern Professional + Data Visualization + Safety-First

### Color Palette
- Primary: #0F172A (Deep Navy - background, headers)
- Secondary: #1E293B (Slate - cards, sections)
- Accent: #EF4444 (Safety Red - alerts, critical actions)
- Success: #10B981 (Green - completed, safe)
- Warning: #F59E0B (Amber - pending, caution)
- Info: #3B82F6 (Blue - information, links)
- Text: #F8FAFC (White), #94A3B8 (Light Gray - secondary text)

### Typography
- Heading1: Inter font-weight 700 (32px)
- Heading2: Inter font-weight 600 (24px)
- Heading3: Inter font-weight 600 (18px)
- Body/Normal: Inter font-weight 400 (14px)
- Body/Emphasize: Inter font-weight 600 (14px)
- Navigation: Inter font-weight 500 (14px)

### Key Component Styles
- **Buttons**: Red background (#EF4444) for primary actions, white text, 6px rounded, hover: brighten 10%
- **Cards**: Dark slate (#1E293B), 1px border (#334155), 8px rounded, hover: subtle lift
- **Forms**: Dark inputs with border, focus: blue accent ring
- **Status Badges**: Rounded-full pills with appropriate color coding

### Layout & Spacing
- Dashboard: Grid layout with responsive columns
- Mobile: Single column, bottom navigation
- Section padding: 24px vertical, 16px horizontal
- Card spacing: 16px gaps

### Images to Generate
1. **hazard-reporting-icon.png** - Icon representing hazard reporting (Style: minimalist, safety theme)
2. **incident-alert-icon.png** - Icon for incident alerts (Style: minimalist, urgent)
3. **action-tracking-icon.png** - Icon for action items (Style: minimalist, checklist)
4. **dashboard-hero.jpg** - Professional industrial safety scene (Style: photorealistic, oil & gas facility)

---

## Development Tasks

### 1. Database Setup
- Create organizations table (tenant isolation)
- Create locations table (office/site/vessel)
- Create hazards table (with category, severity, status, GPS coordinates)
- Create incidents table (with type, classification, severity)
- Create actions table (with status, owner, due_date, verification)
- Create inspections table (with template, findings)
- Create attachments table (for photos/videos/documents)

### 2. Generate Mock Data
- Insert sample organizations (2-3 oil & gas companies)
- Insert sample locations (offices, drilling sites, vessels)
- Insert 20+ hazard reports with various categories and severities
- Insert 10+ incident reports with different classifications
- Insert 30+ actions linked to hazards/incidents
- Insert sample inspection records

### 3. Authentication Pages
- Create Login page with email/password form
- Create AuthCallback page for token handling
- Add authentication check in App.tsx
- Implement protected routes

### 4. Hazard Reporting (Mobile-Responsive)
- Photo upload component with camera/gallery simulation
- Voice note recording simulation
- AI category/severity suggestion (gemini-2.5-pro)
- GPS location input field
- Offline status indicator
- Submit form with validation

### 5. Incident Reporting (Mobile-Responsive)
- Incident type dropdown (First Aid, MTI, LTI, Environmental, Property Damage)
- Description textarea with voice-to-text simulation
- Immediate action field
- Photo evidence upload
- Submit functionality

### 6. Dashboard
- KPI cards: Total Hazards, Total Incidents, Open Actions, Overdue Actions
- Trend chart: Hazards/Incidents over time (recharts)
- Hotspot chart: By location
- AI narrative summary panel (gemini-2.5-pro)
- Filters: Date range picker, location dropdown, contractor dropdown

### 7. Action Tracking Interface
- Action list table with columns: ID, Title, Status, Owner, Due Date, Priority
- Status filter tabs: All, Open, In Progress, Completed, Overdue
- Action detail modal with description, evidence, verification
- Approve/Reject buttons for verification
- Overdue highlighting (red badge)

### 8. Navigation & Layout
- Responsive header with logo, navigation menu
- Mobile bottom navigation (Dashboard, Report, Actions, Profile)
- User profile dropdown with role display and logout
- Sidebar for desktop view

### 9. AI Integration
- Backend endpoint: /api/v1/ai/suggest-category (for hazard categorization)
- Backend endpoint: /api/v1/ai/generate-summary (for dashboard insights)
- Backend endpoint: /api/v1/ai/detect-duplicate (for duplicate detection)
- Frontend integration using client.apiCall.invoke

### 10. Testing & Polish
- Test all CRUD operations
- Verify responsive design (mobile, tablet, desktop)
- Test AI features
- Run pnpm run lint
- Run pnpm run build
- Final UI check

---

## File Structure

```
src/
├── pages/
│   ├── Index.tsx (Dashboard)
│   ├── Login.tsx
│   ├── AuthCallback.tsx
│   ├── HazardReport.tsx
│   ├── IncidentReport.tsx
│   ├── ActionTracking.tsx
│   └── NotFound.tsx
├── components/
│   ├── ui/ (shadcn components)
│   ├── Layout.tsx
│   ├── Header.tsx
│   ├── MobileNav.tsx
│   ├── KPICard.tsx
│   ├── TrendChart.tsx
│   ├── ActionTable.tsx
│   ├── PhotoUpload.tsx
│   └── AIInsightPanel.tsx
├── lib/
│   ├── api.ts (Web SDK client)
│   └── utils.ts
└── App.tsx
```