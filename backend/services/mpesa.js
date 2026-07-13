export function getPaymentConfig() {
  return {
    paybill: process.env.MPESA_PAYBILL || "126914",
    till: process.env.MPESA_TILL || "4062256",
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
