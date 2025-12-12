exports.generateBillNumber = () => {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(100 + Math.random() * 900);
  return `BILL-${y}${m}${d}-${rand}`;
};
