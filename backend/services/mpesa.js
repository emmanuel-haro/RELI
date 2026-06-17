import axios from "axios";

const SANDBOX_BASE = "https://sandbox.safaricom.co.ke";
const LIVE_BASE = "https://api.safaricom.co.ke";

function getBaseUrl() {
  return process.env.MPESA_ENV === "live" ? LIVE_BASE : SANDBOX_BASE;
}

async function getAccessToken() {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  if (!key || !secret) {
    throw new Error("M-Pesa credentials not configured");
  }
  const auth = Buffer.from(`${key}:${secret}`).toString("base64");
  const { data } = await axios.get(`${getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  return data.access_token;
}

function formatPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}

function getTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  );
}

function getPassword(shortcode, passkey, timestamp) {
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
}

/**
 * Initiate STK Push for PayBill or Buy Goods (Till).
 * @param {"mpesa_paybill"|"mpesa_buygoods"} method
 */
export async function initiateStkPush({ phone, amount, method, accountReference, donorName }) {
  const token = await getAccessToken();
  const timestamp = getTimestamp();
  const shortcode = process.env.MPESA_SHORTCODE || "174379";
  const passkey = process.env.MPESA_PASSKEY;
  const callbackUrl = process.env.MPESA_CALLBACK_URL;

  if (!passkey || !callbackUrl) {
    throw new Error("M-Pesa passkey and callback URL must be configured");
  }

  const isPaybill = method === "mpesa_paybill";
  const partyB = isPaybill
    ? process.env.MPESA_PAYBILL || shortcode
    : process.env.MPESA_TILL || shortcode;

  const payload = {
    BusinessShortCode: shortcode,
    Password: getPassword(shortcode, passkey, timestamp),
    Timestamp: timestamp,
    TransactionType: isPaybill ? "CustomerPayBillOnline" : "CustomerBuyGoodsOnline",
    Amount: Math.round(amount),
    PartyA: formatPhone(phone),
    PartyB: partyB,
    PhoneNumber: formatPhone(phone),
    CallBackURL: callbackUrl,
    AccountReference: (accountReference || "RELI-Donation").slice(0, 12),
    TransactionDesc: `RELI Donation${donorName ? ` - ${donorName}` : ""}`.slice(0, 13),
  };

  const { data } = await axios.post(`${getBaseUrl()}/mpesa/stkpush/v1/processrequest`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
}

export function getPaymentConfig() {
  return {
    paybill: process.env.MPESA_PAYBILL || "600000",
    till: process.env.MPESA_TILL || "174379",
    shortcode: process.env.MPESA_SHORTCODE || "174379",
    bank: {
      name: process.env.BANK_NAME || "Kenya Commercial Bank",
      accountName: process.env.BANK_ACCOUNT_NAME || "Hope for Life Agency",
      accountNumber: process.env.BANK_ACCOUNT_NUMBER || "1234567890",
      branch: process.env.BANK_BRANCH || "Kilifi Branch",
      swift: process.env.BANK_SWIFT || "KCBLKENX",
    },
    env: process.env.MPESA_ENV || "sandbox",
  };
}
