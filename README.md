# Opsmobile — ICF Ops Hub

A field-ops mobile-first web app for concrete/ICF contractors. Designed for foremen and crews wearing gloves on the jobsite.

🌐 **Live:** [icfops.srv1427612.hstgr.cloud](https://icfops.srv1427612.hstgr.cloud)

---

## 📱 Tech Stack

- **Frontend:** React Native / Expo (TypeScript) — mobile-first, bottom-tab + drawer navigation, 48px+ tap targets
- **Backend:** FastAPI (Python) — REST API with JWT authentication
- **Database:** MongoDB (Motor async driver)
- **Hosting:** Emergent platform
- **Design:** Rugged Swiss style — safety-orange (#FF6A00) accent, high-contrast, sharp corners

## 🧰 Features

| Module | Description |
|--------|-------------|
| **Bracing Engine** | ACI 347 lateral concrete pressure calcs — brace spacing, count, hardware, safety factor |
| **Quick Estimator** | Wall area → ICF blocks, concrete yardage, rebar tonnage, printable BOM |
| **Equipment** | Fleet inventory tracking with utilization stats (18% currently on rent) |
| **Rentals** | Active rental management with due tracking |
| **Bookings** | Schedule and manage equipment bookings |
| **Capacity** | View capacity across 16 SKUs / 2,224+ units |
| **Calendar** | Operations calendar view |
| **Maintenance** | Service due tracking and inspection schedules |
| **Vendors** | Vendor directory and management |
| **Quote Analyzer** | Compare and analyze supplier quotes |
| **Leads** | Lead tracking and management |
| **Site Admin** | Branding, login copy, operational defaults |

## 🚀 Getting Started

### Web (No Install)

Open in any browser — no APK, no setup:

```
https://icfops.srv1427612.hstgr.cloud
```

### Mobile App (Expo)

```bash
cd frontend
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone, or press `a` for Android / `i` for iOS.

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@icfhub.com | admin123 |
| Foreman | foreman@icfhub.com | foreman123 |

## 🎨 Design Philosophy

- **Utilitarian & rugged** — built for the trailer and the truck
- **Swiss/High-Contrast** — white backgrounds, thick borders, sharp corners
- **Glove-friendly** — 48px+ minimum tap targets on all interactive elements
- **Orange accent** — #FF6A00 safety-orange for primary actions and focus states
- **Monospace numbers** — all numeric outputs use mono font for readability
- **Lucide icons** — stroke-width 2.5+ for visibility on construction sites

## 📁 Repository Structure

```
Opsmobile/
├── .emergent/          # Emergent deployment config
├── backend/            # FastAPI Python backend
├── frontend/           # Expo React Native app
├── memory/             # Agent memory context
├── tests/              # Test suites
├── test_reports/       # Test output reports
├── design_guidelines.json  # UI/UX design system
├── test_result.md      # Testing protocol & results
└── README.md
```

## 🧪 Testing

This project uses a dual-agent testing protocol (main agent + testing agent). See `test_result.md` for the current test state and history.

---

Built with [Emergent](https://app.emergent.sh) · ACI 347 · ASCE 7