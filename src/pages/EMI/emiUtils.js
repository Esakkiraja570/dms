// ✅ FORMAT CURRENCY
export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(Number(value || 0));


// ✅ SAFE NUMBER
export const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};


// ✅ STATUS NORMALIZER
export const normalizeStatus = (status, balance = 0) => {
  if (toNumber(balance) <= 0) return "PAID";

  const normalized = String(status || "ACTIVE").toUpperCase();
  return normalized || "ACTIVE";
};


// ✅ 🔥 MAIN LOGIC: DUE SNAPSHOT (MONTHLY + WEEKLY SUPPORT)
export const getDueSnapshot = (customer) => {

  const balance = toNumber(customer?.balance);

  // ✅ Closed loan
  if (balance <= 0) {
    return {
      label: "Closed",
      tone: "paid",
      sortValue: Number.POSITIVE_INFINITY
    };
  }

  const dueDay = toNumber(customer?.dueDate); // 1–31
  const paymentType = (customer?.paymentType || "MONTHLY").toUpperCase();

  if (!dueDay) {
    return {
      label: "Not set",
      tone: "pending",
      sortValue: Number.POSITIVE_INFINITY
    };
  }

  const today = new Date();

  // =========================
  // 📅 MONTHLY LOGIC
  // =========================
  if (paymentType === "MONTHLY") {

    let dueDate = new Date(today.getFullYear(), today.getMonth(), dueDay);

    // if already passed → next month
    if (today > dueDate) {
      dueDate = new Date(today.getFullYear(), today.getMonth() + 1, dueDay);
    }

    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: `${Math.abs(diffDays)} day overdue`,
        tone: "overdue",
        sortValue: diffDays
      };
    }

    if (diffDays === 0) {
      return {
        label: "Due today",
        tone: "due-today",
        sortValue: 0
      };
    }

    if (diffDays <= 3) {
      return {
        label: `Due in ${diffDays} day${diffDays > 1 ? "s" : ""}`,
        tone: "upcoming",
        sortValue: diffDays
      };
    }

    return {
      label: `Due in ${diffDays} days`,
      tone: "active",
      sortValue: diffDays
    };
  }

  // =========================
  // 📅 WEEKLY LOGIC
  // =========================
  if (paymentType === "WEEKLY") {

    // dueDay: 0 (Sunday) → 6 (Saturday)
    const todayDay = today.getDay();

    let diff = dueDay - todayDay;

    // if passed → next week
    if (diff <= 0) diff += 7;

    const dueDate = new Date();
    dueDate.setDate(today.getDate() + diff);

    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return {
        label: "Due today",
        tone: "due-today",
        sortValue: 0
      };
    }

    if (diffDays <= 2) {
      return {
        label: `Due in ${diffDays} day${diffDays > 1 ? "s" : ""}`,
        tone: "upcoming",
        sortValue: diffDays
      };
    }

    return {
      label: `Next due in ${diffDays} days`,
      tone: "active",
      sortValue: diffDays
    };
  }

  // fallback
  return {
    label: "Active",
    tone: "active",
    sortValue: 999
  };
};


// ✅ BUILD DASHBOARD STATS
export const buildCustomerInsights = (customers = []) => {

  const totals = customers.reduce(
    (acc, c) => {

      const loan = toNumber(c.loanAmount);
      const balance = toNumber(c.balance);
      const paid = toNumber(c.totalPaid || (c.totalAmount - balance));
      const due = getDueSnapshot(c);

      acc.totalLoan += loan;
      acc.totalBalance += balance;
      acc.totalPaid += paid;

      if (due.tone === "overdue") acc.overdueCustomers += 1;
      if (due.tone === "due-today") acc.dueToday += 1;
      if (due.tone === "paid") acc.closedCustomers += 1;

      return acc;
    },
    {
      totalLoan: 0,
      totalBalance: 0,
      totalPaid: 0,
      overdueCustomers: 0,
      dueToday: 0,
      closedCustomers: 0
    }
  );

  return {
    ...totals,
    totalCustomers: customers.length,
    activeCustomers: Math.max(customers.length - totals.closedCustomers, 0)
  };
};