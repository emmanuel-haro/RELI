# RELI — Hope for Life Agency

Full-stack website for the **Reintegration & Early Learning Institute (RELI)** with separated frontend and backend.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, JavaScript (JSX), Vite, Tailwind CSS v4, Framer Motion, React Router |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose) |
| **Payments** | M-Pesa PayBill, M-Pesa Buy Goods (Till), Bank Transfer |
| **API Testing** | Postman collection in `postman/` |

## Project Structure

```
├── frontend/          # React JSX application
│   ├── src/
│   │   ├── pages/     # All route pages
│   │   ├── components/
│   │   └── api/       # API client
│   └── package.json
├── backend/           # Express API server
│   ├── routes/        # messages, payments
│   ├── models/        # MongoDB schemas
│   ├── services/      # M-Pesa, email
│   └── package.json
└── postman/           # Postman API collection
```

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

### Install

```bash
npm run install:all
```

### Configure Backend

Copy `backend/.env.example` to `backend/.env` and update:

- `MONGODB_URI` — your MongoDB connection
- `MPESA_*` — Safaricom Daraja API credentials (for live M-Pesa STK Push)
- `BANK_*` — your real bank account details
- `SMTP_*` — optional email notifications

### Run Development

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Postman

Import `postman/RELI-API.postman_collection.json` into Postman to test all API endpoints.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/messages` | Submit contact form |
| GET | `/api/messages` | List messages |
| GET | `/api/payments/config` | Payment details (PayBill, Till, Bank) |
| POST | `/api/payments/mpesa/stk` | Initiate M-Pesa STK Push |
| POST | `/api/payments/bank` | Record bank transfer donation |
| GET | `/api/payments/status/:id` | Check payment status |

## Production Build

```bash
npm run build
npm start
```

Serve the `frontend/dist` folder with any static host and point `VITE_API_URL` to your backend.
