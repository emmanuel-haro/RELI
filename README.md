# RELI — Hope for Life Agency

Full-stack website for the **Reintegration & Early Learning Institute (RELI)** with separated frontend and backend.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, JavaScript (JSX), Vite, Tailwind CSS v4, Framer Motion, React Router |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose) |
| **Payments** | M-Pesa PayBill, M-Pesa Buy Goods (Till), Bank Transfer |

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

- `MONGODB_URI` — your MongoDB connection string. If using Atlas, whitelist your current IP address in the cluster network access settings.
- `CLIENT_URL` — your front-end origin, typically `http://localhost:5173` during development.
- `SENDGRID_API_KEY` — a valid SendGrid API key starting with `SG.`.
- `EMAIL_FROM` — a verified SendGrid sender identity. In SendGrid, verify this address as a Single Sender or authenticate its domain before sending.
- `NOTIFY_EMAIL` — recipient inbox for contact and donation notifications (for this setup: `hope4lifeagency@gmail.com`).
- `MPESA_*` — Safaricom Daraja API credentials (for live M-Pesa STK Push).
- `BANK_*` — your real bank account details.
- `SMTP_*` — optional email notifications for local testing only; Render free tier blocks outbound SMTP.

### Run Development

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/messages` | Submit contact form |
| GET | `/api/messages` | List messages |
| GET | `/api/payments/config` | Payment details (PayBill, Till, Bank) |
| POST | `/api/payments/bank` | Record manual M-Pesa or bank transfer donation |
| POST | `/api/payments/bank` | Record bank transfer donation |
| GET | `/api/payments/status/:id` | Check payment status |

## Production Build

```bash
npm run build
npm start
```

Serve the `frontend/dist` folder with any static host and point `VITE_API_URL` to your backend.
