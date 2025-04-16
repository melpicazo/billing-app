# Meia Capital Billing App

Welcome to the Meia Capital Internal Portal – a modern, full-stack application for managing and visualizing client billing tiers and asset calculations.
This was built with React, Express, Node.js and connected to a PostgreSQL database.

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- pnpm (v8 or higher)

### Installation and Setup

In the project root folder, follow these steps:

1. **Backend Setup**

```bash
cd backend
pnpm install
pnpm dev
```

The backend server will start on http://localhost:3000

2. **Frontend Setup**

```bash
cd frontend
pnpm install
pnpm dev
```

The frontend development server will start on http://localhost:5173

## Project Structure

```
billing-app/
├── backend/          # Express + Node.js backend server
├── frontend/         # React frontend application
│   ├── src/
│   │   ├── api/     # API integration
│   │   ├── components/ # Components folder with contexts, UI, and data viz
│   │   └── shared/  # Shared utilities and types
└── README.md
```

## Technical Stack

### Frontend

- React with TypeScript
- `recharts` for data visualization
- TailwindCSS for styling
- React Context for state management

### Backend

- Node.js with TypeScript
- Express.js
- File upload handling
- RESTful API design

## Fee Calculation Details

The management fee calculation follows a specific hierarchy:

1. **Portfolio Level**: Each portfolio's fee is calculated individually based on:

   - Portfolio's total AUM
   - Applicable billing tier rate
   - Currency conversion (if portfolio is in USD. Conversion rate: 1.00 Canadian Dollar = 0.71 US Dollars)

2. **Client Level**: A client's total management fee is the sum of all their portfolio fees
   - Multiple portfolios per client are supported
   - All fees are converted to CAD for final reporting
   - Effective fee rate = Total fees in CAD / Total AUM in CAD
