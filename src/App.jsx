import { useEffect, useState } from "react";

import "./App.css";

function App() {
  // =========================
  // DATE HELPERS
  // =========================

  const getToday = () => {
    return new Date().toISOString().split("T")[0];
  };

  const getCurrentMonth = () => {
    return new Date().toISOString().slice(0, 7);
  };

  const formatMonth = (month) => {
    if (!month) return "";

    const [year, monthNumber] = month.split("-");

    return new Date(
      Number(year),
      Number(monthNumber) - 1,
      1
    ).toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  };

  const formatExpenseDate = (date) => {
    const safeDate = date || getToday();

    return new Date(`${safeDate}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================
  // CURRENT MONTH
  // =========================

  const [currentMonth, setCurrentMonth] = useState(() => {
    return (
      localStorage.getItem("finglass_current_month") ||
      getCurrentMonth()
    );
  });

  useEffect(() => {
    localStorage.setItem(
      "finglass_current_month",
      currentMonth
    );
  }, [currentMonth]);

  // =========================
  // MONTHLY HISTORY
  // =========================

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("finglass_history");

    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "finglass_history",
      JSON.stringify(history)
    );
  }, [history]);

  // =========================
  // PREVIOUS SAVINGS
  // =========================

  const [previousSavings, setPreviousSavings] = useState(() => {
    const saved = localStorage.getItem(
      "finglass_previous_savings"
    );

    return saved !== null ? Number(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem(
      "finglass_previous_savings",
      previousSavings
    );
  }, [previousSavings]);

  // =========================
  // FINANCIAL GOALS
  // =========================

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem("finglass_goals");

    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "finglass_goals",
      JSON.stringify(goals)
    );
  }, [goals]);

  // =========================
// INCOME SOURCES — V2 PHASE 1
// =========================

const [incomeSources, setIncomeSources] = useState(() => {
  const saved = localStorage.getItem("finglass_income_sources");

  if (saved) {
    try {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (error) {
      console.error("Unable to load income sources:", error);
    }
  }

  // Backward compatibility with V1
  const oldIncome = localStorage.getItem("finglass_income");

  if (oldIncome !== null) {
    const oldAmount = Number(oldIncome);

    if (oldAmount > 0) {
      return [
        {
          id: `income-migrated-${Date.now()}`,
          name: "Primary Income",
          amount: oldAmount,
        },
      ];
    }
  }

  return [];
});

useEffect(() => {
  localStorage.setItem(
    "finglass_income_sources",
    JSON.stringify(incomeSources)
  );

  // Keep V1 compatibility
  localStorage.setItem(
    "finglass_income",
    incomeSources.reduce(
      (total, source) =>
        total + Number(source.amount || 0),
      0
    )
  );
}, [incomeSources]);

const income = incomeSources.reduce(
  (total, source) =>
    total + Number(source.amount || 0),
  0
);

const [newIncomeName, setNewIncomeName] = useState("");
const [newIncomeAmount, setNewIncomeAmount] = useState("");

const addIncomeSource = () => {
  const name = newIncomeName.trim();
  const amount = Number(newIncomeAmount);

  if (
    !name ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return;
  }

  setIncomeSources((currentSources) => [
    ...currentSources,
    {
      id: `income-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      name,
      amount,
    },
  ]);

  setNewIncomeName("");
  setNewIncomeAmount("");
};

const deleteIncomeSource = (incomeId) => {
  setIncomeSources((currentSources) =>
    currentSources.filter(
      (source) => source.id !== incomeId
    )
  );
};

  // =========================
  // EXPENSES
  // =========================

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("finglass_expenses");

    if (saved) {
      const parsedExpenses = JSON.parse(saved);

      return parsedExpenses.map((expense) => ({
        ...expense,
        date: expense.date || getToday(),
      }));
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      "finglass_expenses",
      JSON.stringify(expenses)
    );
  }, [expenses]);

  const [newExpense, setNewExpense] = useState("");
  const [newAmount, setNewAmount] = useState("");

  // =========================
  // SUBSCRIPTIONS
  // =========================

  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem(
      "finglass_subscriptions"
    );

    if (!saved) return [];

    return JSON.parse(saved).map(
      (subscription, index) => ({
        ...subscription,
        id:
          subscription.id ||
          `subscription-${index}-${String(
            subscription.name || "subscription"
          )
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")}`,
      })
    );
  });

  useEffect(() => {
    localStorage.setItem(
      "finglass_subscriptions",
      JSON.stringify(subscriptions)
    );
  }, [subscriptions]);

  const [newSubscription, setNewSubscription] = useState("");

  const [
    newSubscriptionAmount,
    setNewSubscriptionAmount,
  ] = useState("");

  // =========================
  // TRIP EXPENSES
  // =========================

  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem("finglass_trips");

    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "finglass_trips",
      JSON.stringify(trips)
    );
  }, [trips]);

  const [newTripName, setNewTripName] = useState("");

  const [newTripDestination, setNewTripDestination] =
    useState("");

  const [newTripStartDate, setNewTripStartDate] =
    useState(getToday());

  const [newTripEndDate, setNewTripEndDate] =
    useState(getToday());

  const [selectedTripId, setSelectedTripId] =
    useState(null);

  const [newTripExpenseName, setNewTripExpenseName] =
    useState("");

  const [newTripExpenseAmount, setNewTripExpenseAmount] =
    useState("");

  // =========================
  // EMI MANAGER
  // =========================

  const [emis, setEmis] = useState(() => {
    const saved = localStorage.getItem("finglass_emis");

    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "finglass_emis",
      JSON.stringify(emis)
    );
  }, [emis]);

  const [newEmiName, setNewEmiName] = useState("");
  const [newEmiTotalAmount, setNewEmiTotalAmount] = useState("");
  const [newEmiAmount, setNewEmiAmount] = useState("");
  const [newEmiPaidAmount, setNewEmiPaidAmount] = useState("");
  const [newEmiDueDay, setNewEmiDueDay] = useState("");

  // =========================
  // NEW GOAL INPUTS
  // =========================

  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  

  // =========================
  // HISTORY UI
  // =========================

  const [showHistory, setShowHistory] = useState(false);

  // =========================
  // GLASS BOX
  // =========================

  const [showWhy, setShowWhy] = useState(false);

  // =========================
  // WHAT-IF SIMULATOR
  // =========================

  const [whatIfAmount, setWhatIfAmount] = useState("");
  const [showWhatIf, setShowWhatIf] = useState(false);

  const [glassBoxResult, setGlassBoxResult] = useState(null);

  // =========================
  // FINANCIAL AGENT
  // =========================

  const [agentQuestion, setAgentQuestion] = useState("");

  const [agentResponse, setAgentResponse] = useState("");

  const [
    showAgentReasoning,
    setShowAgentReasoning,
  ] = useState(false);

  const [agentReasoning, setAgentReasoning] = useState([]);

  // =========================
  // MONTH CHANGE DETECTION
  // =========================

  useEffect(() => {
    const actualMonth = getCurrentMonth();

    if (actualMonth === currentMonth) {
      return;
    }

    const totalOldExpenses = expenses.reduce(
      (total, expense) =>
        total + Number(expense.amount),
      0
    );

    const oldMonthSavings =
      income - totalOldExpenses;

    const oldMonthRecord = {
      month: currentMonth,
      income: income,
      expenses: expenses,
      trips: trips,
      totalExpenses: totalOldExpenses,
      savings: oldMonthSavings,
      savedAt: new Date().toISOString(),
    };

    setHistory((currentHistory) => {
      const alreadyExists = currentHistory.some(
        (item) => item.month === currentMonth
      );

      if (alreadyExists) {
        return currentHistory;
      }

      return [
        ...currentHistory,
        oldMonthRecord,
      ];
    });

    setPreviousSavings(oldMonthSavings);

    // Start new month fresh
setIncomeSources([]);
setExpenses([]);
setSubscriptions([]);
setTrips([]);
    setSelectedTripId(null);

    // IMPORTANT:
    // EMIs are recurring monthly commitments,
    // so they are NOT reset when the month changes.

    localStorage.setItem(
      "finglass_expenses",
      JSON.stringify([])
    );

    localStorage.setItem(
      "finglass_subscriptions",
      JSON.stringify([])
    );

    localStorage.setItem(
      "finglass_trips",
      JSON.stringify([])
    );

    setCurrentMonth(actualMonth);
  }, []);

  // =========================
  // RESET FINANCIAL DATA
  // =========================

  const resetFinancialData = () => {
  setIncomeSources([]);
    setExpenses([]);
    setGoals([]);
    setSubscriptions([]);
    setTrips([]);
    setEmis([]);
    setSelectedTripId(null);
    setHistory([]);
    setPreviousSavings(0);
    setCurrentMonth(getCurrentMonth());

    localStorage.removeItem("finglass_income");
    localStorage.removeItem("finglass_expenses");
    localStorage.removeItem("finglass_goals");
    localStorage.removeItem("finglass_subscriptions");
    localStorage.removeItem("finglass_trips");
    localStorage.removeItem("finglass_emis");
    localStorage.removeItem("finglass_history");
    localStorage.removeItem("finglass_previous_savings");
    localStorage.removeItem("finglass_income_sources");
    localStorage.setItem(
      "finglass_current_month",
      getCurrentMonth()
    );
  };

  // =========================
  // EXPORT FINANCIAL DATA
  // =========================

  const exportFinancialData = () => {
    const financialData = {
  currentMonth,
  income,
  incomeSources,
  expenses,
  subscriptions,
      goals,
      trips,
      emis,
      history,
      previousSavings,
      exportedAt: new Date().toISOString(),
    };

    const data = JSON.stringify(
      financialData,
      null,
      2
    );

    const blob = new Blob([data], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "finglass-backup.json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =========================
  // IMPORT FINANCIAL DATA
  // =========================

  const importFinancialData = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        const hasValidIncomeData =
  Array.isArray(data.incomeSources) ||
  typeof data.income === "number";

if (
  !hasValidIncomeData ||
  !Array.isArray(data.expenses) ||
  !Array.isArray(data.subscriptions) ||
  !Array.isArray(data.goals)
) {
  alert("Invalid FinGlass backup file.");
  return;
}

        const normalizedExpenses = data.expenses.map(
          (expense) => ({
            ...expense,
            date: expense.date || getToday(),
          })
        );

        const importedIncomeSources =
  Array.isArray(data.incomeSources)
    ? data.incomeSources
    : typeof data.income === "number" && data.income > 0
    ? [
        {
          id: `income-imported-${Date.now()}`,
          name: "Primary Income",
          amount: data.income,
        },
      ]
    : [];

setIncomeSources(importedIncomeSources);
setExpenses(normalizedExpenses);
        setSubscriptions(data.subscriptions);
        setGoals(data.goals);

        // Backward compatible:
        // Old backup files may not contain trips.
        setTrips(
          Array.isArray(data.trips)
            ? data.trips
            : []
        );

        // Backward compatible:
        // Old backup files may not contain the newer EMI payment fields.
        setEmis(
          Array.isArray(data.emis)
            ? data.emis.map((emi) => ({
                ...emi,
                totalAmount: Number(emi.totalAmount ?? emi.monthlyAmount ?? 0),
                paidAmount: Number(emi.paidAmount ?? 0),
                paymentHistory: Array.isArray(emi.paymentHistory)
                  ? emi.paymentHistory
                  : [],
              }))
            : []
        );

        setSelectedTripId(null);

        if (Array.isArray(data.history)) {
          setHistory(data.history);
        }

        if (
          typeof data.previousSavings ===
          "number"
        ) {
          setPreviousSavings(
            data.previousSavings
          );
        }

        if (data.currentMonth) {
          setCurrentMonth(
            data.currentMonth
          );
        }

        alert(
          "FinGlass data restored successfully! ✅"
        );
      } catch (error) {
        console.error(error);

        alert(
          "Unable to read the backup file."
        );
      }
    };

    reader.readAsText(file);

    event.target.value = "";
  };

  // =========================
  // CALCULATIONS
  // =========================

  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount),
    0
  );

  const monthlySavings =
    income - totalExpenses;

  const totalSavings =
    previousSavings + monthlySavings;

  const savingsRate =
    income > 0
      ? (
          (monthlySavings / income) *
          100
        ).toFixed(1)
      : 0;

  // =========================
  // EMI CALCULATIONS
  // =========================

  const getEmiPaidAmount = (emi) => {
    const recordedPayments = Array.isArray(emi.paymentHistory)
      ? emi.paymentHistory.reduce(
          (total, payment) => total + Number(payment.amount || 0),
          0
        )
      : 0;

    return Math.min(
      Number(emi.totalAmount ?? emi.monthlyAmount) || 0,
      (Number(emi.paidAmount) || 0) + recordedPayments
    );
  };

  const getEmiTotalAmount = (emi) =>
    Number(emi.totalAmount ?? emi.monthlyAmount) || 0;

  const getEmiRemainingAmount = (emi) =>
    Math.max(0, getEmiTotalAmount(emi) - getEmiPaidAmount(emi));

  const getEmiRemainingInstallments = (emi) => {
    const monthlyAmount = Number(emi.monthlyAmount) || 0;
    const remainingAmount = getEmiRemainingAmount(emi);

    return monthlyAmount > 0
      ? Math.ceil(remainingAmount / monthlyAmount)
      : 0;
  };

  const totalEmiMonthly = emis.reduce(
    (total, emi) =>
      total + Number(emi.monthlyAmount),
    0
  );

  const totalEmiRemaining = emis.reduce(
    (total, emi) => total + getEmiRemainingAmount(emi),
    0
  );

  const totalEmiPaid = emis.reduce(
    (total, emi) => total + getEmiPaidAmount(emi),
    0
  );

  // =========================
  // EMI DATE HELPERS
  // =========================

  const getClampedEmiDate = (
    year,
    month,
    dueDay
  ) => {
    const lastDay = new Date(
      year,
      month + 1,
      0
    ).getDate();

    const safeDay = Math.min(
      Math.max(Number(dueDay), 1),
      lastDay
    );

    return new Date(
      year,
      month,
      safeDay
    );
  };

  const getEmiDueKey = (date) => {
    const value = new Date(date);

    return `${value.getFullYear()}-${String(
      value.getMonth() + 1
    ).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
  };

  const hasPaymentForDueDate = (emi, dueDate) => {
    const dueKey = getEmiDueKey(dueDate);

    return Array.isArray(emi.paymentHistory)
      ? emi.paymentHistory.some(
          (payment) => payment.dueKey === dueKey
        )
      : false;
  };

  const getNextEmiDueDate = (emi) => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    let year = today.getFullYear();
    let month = today.getMonth();

    let dueDate = getClampedEmiDate(
      year,
      month,
      emi.dueDay
    );

    // If this month's EMI has already been paid, move to the next unpaid month.
    while (hasPaymentForDueDate(emi, dueDate)) {
      month++;

      if (month > 11) {
        month = 0;
        year++;
      }

      dueDate = getClampedEmiDate(
        year,
        month,
        emi.dueDay
      );
    }

    return dueDate;
  };

  const getDaysUntilEmi = (date) => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const target = new Date(date);

    target.setHours(0, 0, 0, 0);

    return Math.ceil(
      (target - today) /
        (1000 * 60 * 60 * 24)
    );
  };

  const formatEmiDueDate = (date) => {
    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================
  // EMI FUNCTIONS
  // =========================

  const addEmi = () => {
    const totalAmount = Number(newEmiTotalAmount);
    const monthlyAmount = Number(newEmiAmount);
    const paidAmount = Number(newEmiPaidAmount || 0);
    const dueDay = Number(newEmiDueDay);

    if (
      !newEmiName.trim() ||
      !Number.isFinite(totalAmount) ||
      totalAmount <= 0 ||
      !Number.isFinite(monthlyAmount) ||
      monthlyAmount <= 0 ||
      !Number.isFinite(paidAmount) ||
      paidAmount < 0 ||
      paidAmount > totalAmount
    ) {
      return;
    }

    if (
      !Number.isInteger(dueDay) ||
      dueDay < 1 ||
      dueDay > 31
    ) {
      return;
    }

    setEmis((currentEmis) => [
      ...currentEmis,
      {
        id: `${Date.now()}-${Math.random()}`,
        name: newEmiName.trim(),
        totalAmount,
        monthlyAmount,
        paidAmount,
        dueDay,
        paymentHistory: [],
      },
    ]);

    setNewEmiName("");
    setNewEmiTotalAmount("");
    setNewEmiAmount("");
    setNewEmiPaidAmount("");
    setNewEmiDueDay("");
  };

  const recordEmiPayment = (emiId) => {
  const emi = emis.find((item) => item.id === emiId);

  if (!emi) return;

  const remainingAmount = getEmiRemainingAmount(emi);

  if (remainingAmount <= 0) return;

  const dueDate = getNextEmiDueDate(emi);

  const paymentAmount = Math.min(
    Number(emi.monthlyAmount) || 0,
    remainingAmount
  );

  if (
    paymentAmount <= 0 ||
    hasPaymentForDueDate(emi, dueDate)
  ) {
    return;
  }

  const payment = {
    id: `${Date.now()}-${Math.random()}`,
    amount: paymentAmount,
    date: new Date().toISOString(),
    dueKey: getEmiDueKey(dueDate),
    dueDate: dueDate.toISOString(),
  };

  // Record payment inside EMI
  setEmis((currentEmis) =>
    currentEmis.map((currentEmi) => {
      if (currentEmi.id !== emiId) {
        return currentEmi;
      }

      return {
        ...currentEmi,
        paymentHistory: [
          ...(Array.isArray(currentEmi.paymentHistory)
            ? currentEmi.paymentHistory
            : []),
          payment,
        ],
      };
    })
  );

  // Add EMI payment to Expenses
  setExpenses((currentExpenses) => {
    const alreadyAdded = currentExpenses.some(
      (expense) =>
        expense.emiId === emiId &&
        expense.emiDueKey === payment.dueKey
    );

    if (alreadyAdded) {
      return currentExpenses;
    }

    return [
      ...currentExpenses,
      {
        name: `EMI: ${emi.name}`,
        amount: paymentAmount,
        icon: "🏦",
        date: getToday(),
        emiId: emiId,
        emiPaymentId: payment.id,
        emiDueKey: payment.dueKey,
      },
    ];
  });
};

  const deleteEmi = (emiId) => {
    setEmis((currentEmis) =>
      currentEmis.filter(
        (emi) => emi.id !== emiId
      )
    );
  };

  // =========================
  // WHAT-IF CALCULATIONS
  // =========================

  const whatIfValue =
    Number(whatIfAmount) || 0;

  const whatIfNewSavings =
    monthlySavings + whatIfValue;

  const whatIfYearlyImprovement =
    whatIfValue * 12;

  // =========================
  // ADD GOAL
  // =========================

  const addGoal = () => {
  const target = Number(newGoalTarget);

  if (
    !newGoalName.trim() ||
    !Number.isFinite(target) ||
    target <= 0
  ) {
    return;
  }

  setGoals((currentGoals) => [
    ...currentGoals,
    {
      id: `goal-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      name: newGoalName.trim(),
      target,
    },
  ]);

  setNewGoalName("");
  setNewGoalTarget("");
};

  // =========================
  // DELETE GOAL
  // =========================

  const deleteGoal = (index) => {
    setGoals(
      goals.filter(
        (_, i) => i !== index
      )
    );
  };

  // =========================
  // TRIP FUNCTIONS
  // =========================

  const getTripTotal = (trip) => {
    return trip.expenses.reduce(
      (total, expense) =>
        total + Number(expense.amount),
      0
    );
  };

  // =========================
  // ADD TRIP
  // =========================

  const addTrip = () => {
    if (
      !newTripName.trim() ||
      !newTripStartDate ||
      !newTripEndDate
    ) {
      return;
    }

    const trip = {
      id:
        Date.now().toString(),
      name:
        newTripName.trim(),
      destination:
        newTripDestination.trim(),
      startDate:
        newTripStartDate,
      endDate:
        newTripEndDate,
      expenses: [],
    };

    setTrips((currentTrips) => [
      ...currentTrips,
      trip,
    ]);

    setNewTripName("");
    setNewTripDestination("");
    setNewTripStartDate(getToday());
    setNewTripEndDate(getToday());

    setSelectedTripId(trip.id);
  };

  // =========================
  // DELETE TRIP
  // =========================

  const deleteTrip = (tripId) => {
    const trip = trips.find(
      (item) => item.id === tripId
    );

    if (!trip) return;

    setExpenses((currentExpenses) =>
      currentExpenses.filter(
        (expense) =>
          expense.tripId !== tripId
      )
    );

    setTrips((currentTrips) =>
      currentTrips.filter(
        (item) => item.id !== tripId
      )
    );

    if (selectedTripId === tripId) {
      setSelectedTripId(null);
    }
  };

  // =========================
  // ADD TRIP EXPENSE
  // =========================

  const addTripExpense = (tripId) => {
    if (
      !newTripExpenseName.trim() ||
      !newTripExpenseAmount
    ) {
      return;
    }

    const amount =
      Number(newTripExpenseAmount);

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return;
    }

    const expenseName =
      newTripExpenseName.trim();

    const trip = trips.find(
      (item) => item.id === tripId
    );

    if (!trip) return;

    let updatedExpenses;

    const existingIndex =
      trip.expenses.findIndex(
        (expense) =>
          expense.name
            .trim()
            .toLowerCase() ===
          expenseName.toLowerCase()
      );

    if (existingIndex !== -1) {
      updatedExpenses =
        trip.expenses.map(
          (expense, index) =>
            index === existingIndex
              ? {
                  ...expense,
                  amount:
                    Number(
                      expense.amount
                    ) + amount,
                  date: getToday(),
                }
              : expense
        );
    } else {
      updatedExpenses = [
        ...trip.expenses,
        {
          id:
            `${Date.now()}-${Math.random()}`,
          name:
            expenseName,
          amount,
          date: getToday(),
        },
      ];
    }

    const newTripTotal =
      updatedExpenses.reduce(
        (total, expense) =>
          total +
          Number(expense.amount),
        0
      );

    // Update trip details
    setTrips((currentTrips) =>
      currentTrips.map((item) =>
        item.id === tripId
          ? {
              ...item,
              expenses:
                updatedExpenses,
            }
          : item
      )
    );

    // Update main expense list.
    // This makes the trip count toward
    // the main Total Expenses.
    setExpenses((currentExpenses) => {
      const existingTripIndex =
        currentExpenses.findIndex(
          (expense) =>
            expense.tripId === tripId
        );

      const tripExpense = {
        name:
          `Trip: ${trip.name}`,
        amount:
          newTripTotal,
        icon: "🌴",
        date:
          trip.startDate ||
          getToday(),
        tripId:
          tripId,
      };

      if (
        existingTripIndex !== -1
      ) {
        return currentExpenses.map(
          (expense, index) =>
            index ===
            existingTripIndex
              ? tripExpense
              : expense
        );
      }

      return [
        ...currentExpenses,
        tripExpense,
      ];
    });

    setNewTripExpenseName("");
    setNewTripExpenseAmount("");
  };

  // =========================
  // DELETE TRIP EXPENSE
  // =========================

  const deleteTripExpense = (
    tripId,
    expenseId
  ) => {
    const trip = trips.find(
      (item) => item.id === tripId
    );

    if (!trip) return;

    const updatedExpenses =
      trip.expenses.filter(
        (expense) =>
          expense.id !== expenseId
      );

    const newTripTotal =
      updatedExpenses.reduce(
        (total, expense) =>
          total +
          Number(expense.amount),
        0
      );

    setTrips((currentTrips) =>
      currentTrips.map((item) =>
        item.id === tripId
          ? {
              ...item,
              expenses:
                updatedExpenses,
            }
          : item
      )
    );

    setExpenses((currentExpenses) => {
      if (newTripTotal === 0) {
        return currentExpenses.filter(
          (expense) =>
            expense.tripId !== tripId
        );
      }

      return currentExpenses.map(
        (expense) =>
          expense.tripId === tripId
            ? {
                ...expense,
                amount:
                  newTripTotal,
              }
            : expense
      );
    });
  };

  // =========================
  // ADD EXPENSE
  // =========================

  const addExpense = () => {
    if (
      !newExpense ||
      !newAmount
    ) {
      return;
    }

    const amount =
      Number(newAmount);

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return;
    }

    const expenseName =
      newExpense.trim();

    setExpenses(
      (currentExpenses) => {
        const existingExpenseIndex =
          currentExpenses.findIndex(
            (expense) =>
              !expense.tripId &&
              expense.name
                .trim()
                .toLowerCase() ===
                expenseName
                  .toLowerCase()
          );

        if (
          existingExpenseIndex !==
          -1
        ) {
          return currentExpenses.map(
            (expense, index) =>
              index ===
              existingExpenseIndex
                ? {
                    ...expense,
                    amount:
                      Number(
                        expense.amount
                      ) + amount,
                    date:
                      getToday(),
                  }
                : expense
          );
        }

        return [
          ...currentExpenses,
          {
            name:
              expenseName,
            amount:
              amount,
            icon:
              "💸",
            date:
              getToday(),
          },
        ];
      }
    );

    setNewExpense("");
    setNewAmount("");
  };

  // =========================
  // DELETE EXPENSE
  // =========================

  const deleteExpense = (index) => {
    const expense =
      expenses[index];

    if (!expense) return;

    // Trip expenses should be deleted
    // from the trip itself.
    if (expense.tripId) {
      return;
    }

    setExpenses(
      expenses.filter(
        (_, i) => i !== index
      )
    );
  };

  // =========================
  // ADD SUBSCRIPTION
  // =========================

  const addSubscription = () => {
    if (
      !newSubscription ||
      !newSubscriptionAmount
    ) {
      return;
    }

    const subscriptionName =
      newSubscription.trim();
    const subscriptionAmount =
      Number(newSubscriptionAmount);

    if (
      !subscriptionName ||
      !Number.isFinite(subscriptionAmount) ||
      subscriptionAmount <= 0
    ) {
      return;
    }

    const subscriptionId =
      `subscription-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setSubscriptions((currentSubscriptions) => [
      ...currentSubscriptions,
      {
        id: subscriptionId,
        name: subscriptionName,
        amount: subscriptionAmount,
      },
    ]);

    // Spending Breakdown is synchronized below as ONE
    // combined "Subscriptions" expense. Do not add an
    // individual Spotify/Netflix expense here.

    setNewSubscription("");
    setNewSubscriptionAmount("");
  };

  // =========================
  // DELETE SUBSCRIPTION
  // =========================

  const deleteSubscription = (
    index
  ) => {
    if (!subscriptions[index]) return;

    setSubscriptions((currentSubscriptions) =>
      currentSubscriptions.filter(
        (_, i) => i !== index
      )
    );
  };

  // =========================
  // SUBSCRIPTION CALCULATIONS
  // =========================

  const totalSubscriptionMonthly =
    subscriptions.reduce(
      (total, subscription) =>
        total +
        Number(subscription.amount || 0),
      0
    );

  // Keep exactly ONE subscription expense in Spending Breakdown.
  // This also cleans up duplicate subscription expenses created by
  // the previous per-subscription implementation.
  useEffect(() => {
    setExpenses((currentExpenses) => {
      const nonSubscriptionExpenses =
        currentExpenses.filter(
          (expense) =>
            !expense.isSubscriptionExpense &&
            !expense.subscriptionId
        );

      if (totalSubscriptionMonthly <= 0) {
        return nonSubscriptionExpenses;
      }

      return [
        ...nonSubscriptionExpenses,
        {
          id: "subscriptions-expense",
          name: "Subscriptions",
          amount: totalSubscriptionMonthly,
          icon: "🔄",
          date: getToday(),
          isSubscriptionExpense: true,
        },
      ];
    });
  }, [totalSubscriptionMonthly]);

  const totalSubscriptionYearly =
    totalSubscriptionMonthly * 12;

  const subscriptionExpense =
    expenses
      .filter(
        (expense) =>
          expense.isSubscriptionExpense ||
          expense.subscriptionId
      )
      .reduce(
        (total, expense) =>
          total + Number(expense.amount || 0),
        0
      );

  const subscriptionPercentage =
    totalExpenses > 0
      ? (
          (subscriptionExpense /
            totalExpenses) *
          100
        ).toFixed(1)
      : 0;

  // =========================
  // FINANCIAL AGENT LOGIC
  // =========================

  const getLargestExpense = () => {
    if (expenses.length === 0) {
      return {
        name:
          "No expenses",
        amount:
          0,
      };
    }

    return expenses.reduce(
      (largest, expense) =>
        Number(expense.amount) >
        Number(largest.amount)
          ? expense
          : largest
    );
  };

  const askFinancialAgent = async (
    questionText = agentQuestion
  ) => {
    try {
      const response =
        await fetch(
          "https://finglass-backend.onrender.com/agent",
          {
            method:
              "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify({
                question:
                  questionText,
                income:
                  income,
                expenses:
                  expenses,
                subscriptions:
                  subscriptions,
              }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Financial Agent request failed"
        );
      }

      const data =
        await response.json();

      setAgentResponse(
        data.answer
      );

      setAgentReasoning(
        data.reasoning || []
      );

      setShowAgentReasoning(
        false
      );
    } catch (error) {
      console.error(
        "Financial Agent connection error:",
        error
      );

      setAgentResponse(
        "Unable to connect to the FinGlass Financial Agent. Make sure the FastAPI backend is running."
      );

      setShowAgentReasoning(
        false
      );
    }
  };

  // =========================
  // GLASS BOX ANALYSIS
  // =========================

  const runGlassBoxAnalysis =
    async () => {
      try {
        const response =
          await fetch(
            "https://finglass-backend.onrender.com/reason",
            {
              method:
                "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body:
                JSON.stringify({
                  income:
                    income,
                  expenses:
                    expenses,
                }),
            }
          );

        const data =
          await response.json();

        setGlassBoxResult(
          data
        );
      } catch (error) {
        console.error(
          "Glass Box connection error:",
          error
        );
      }
    };

  // =========================
  // UI
  // =========================

  return (
    <div className="app">

      {/* HEADER */}

      <header>

        <div>

          <h1>
            💰 FinGlass
          </h1>

          <p>
            Your money, explained.
          </p>

        </div>

      </header>

      <main>

        {/* WELCOME */}

        <section className="welcome">

          <h2>
            Financial Overview
          </h2>

          <p>
            Understand where your
            money goes.
          </p>

          <p>
            🗓️ Current month:{" "}
            <strong>
              {formatMonth(
                currentMonth
              )}
            </strong>
          </p>

        </section>

        {/* FINANCIAL DATA CONTROLS */}

        <div className="data-buttons">

          <button
            className="data-btn delete-btn"
            onClick={
              resetFinancialData
            }
          >
            🗑️ Delete Financial Data
          </button>

          <button
            className="data-btn export-btn"
            onClick={
              exportFinancialData
            }
          >
            📥 Export Financial Data
          </button>

          <label
            htmlFor="finglass-import"
            className="data-btn import-btn"
          >
            📤 Import Financial Data

            <input
              id="finglass-import"
              type="file"
              accept=".json,application/json"
              onChange={
                importFinancialData
              }
              style={{
                display:
                  "none",
              }}
            />
          </label>

          <button
            className="data-btn"
            onClick={() =>
              setShowHistory(
                !showHistory
              )
            }
          >
            📜{" "}
            {showHistory
              ? "Hide History"
              : "History"}
          </button>

        </div>

        {/* HISTORY */}

        {showHistory && (

          <section className="panel">

            <h2>
              📜 Financial History
            </h2>

            {history.length ===
            0 ? (

              <p>
                No previous month
                history yet.
              </p>

            ) : (

              [...history]
                .reverse()
                .map(
                  (
                    monthData,
                    index
                  ) => (

                    <div
                      key={index}
                      className="goal-info"
                    >

                      <h3>
                        🗓️{" "}
                        {formatMonth(
                          monthData.month
                        )}
                      </h3>

                      <p>
                        💵 Income:{" "}
                        <strong>
                          ₹
                          {Number(
                            monthData.income
                          ).toLocaleString()}
                        </strong>
                      </p>

                      <p>
                        💸 Expenses:{" "}
                        <strong>
                          ₹
                          {Number(
                            monthData.totalExpenses
                          ).toLocaleString()}
                        </strong>
                      </p>

                      <p>
                        💰 Savings:{" "}
                        <strong>
                          ₹
                          {Number(
                            monthData.savings
                          ).toLocaleString()}
                        </strong>
                      </p>

                      {monthData.income >
                        0 && (

                        <p>
                          📊 Savings Rate:{" "}
                          <strong>
                            {(
                              (Number(
                                monthData.savings
                              ) /
                                Number(
                                  monthData.income
                                )) *
                              100
                            ).toFixed(1)}
                            %
                          </strong>
                        </p>

                      )}

                    </div>

                  )
                )

            )}

          </section>

        )}

        {/* DASHBOARD CARDS */}

        <section className="cards">

          <div className="card">

            <span>
              Monthly Income
            </span>

            <h2>
              ₹
              {income.toLocaleString()}
            </h2>

          </div>

          <div className="card">

            <span>
              Total Expenses
            </span>

            <h2>
              ₹
              {totalExpenses.toLocaleString()}
            </h2>

          </div>

          <div className="card">

            <span>
              Monthly Savings
            </span>

            <h2>
              ₹
              {monthlySavings.toLocaleString()}
            </h2>

          </div>

          <div className="card">

            <span>
              Previous Savings
            </span>

            <h2>
              ₹
              {previousSavings.toLocaleString()}
            </h2>

          </div>

          <div className="card">

            <span>
              Total Savings
            </span>

            <h2>
              ₹
              {totalSavings.toLocaleString()}
            </h2>

          </div>

          <div className="card">

            <span>
              Savings Rate
            </span>

            <h2>
              {savingsRate}%
            </h2>

          </div>

        </section>

        {/* INCOME SOURCES — V2 PHASE 1 */}

<section className="panel">

  <h2>
    💵 Monthly Income
  </h2>

  <p>
    Track all your income sources for{" "}
    <strong>
      {formatMonth(currentMonth)}
    </strong>
  </p>

  {/* ADD INCOME SOURCE */}

  <div className="input-row">

    <input
      type="text"
      value={newIncomeName}
      onChange={(e) =>
        setNewIncomeName(e.target.value)
      }
      placeholder="Income source (e.g. Salary)"
    />

    <input
      type="number"
      min="0"
      value={newIncomeAmount}
      onChange={(e) =>
        setNewIncomeAmount(e.target.value)
      }
      placeholder="Monthly amount ₹"
    />

    <button onClick={addIncomeSource}>
      + Add Income
    </button>

  </div>

  {/* INCOME SOURCE LIST */}

  {incomeSources.length === 0 ? (

    <p
      style={{
        marginTop: "18px",
        color: "#667085",
      }}
    >
      No income sources added yet.
    </p>

  ) : (

    <div style={{ marginTop: "18px" }}>

      {incomeSources.map((source) => (

        <div
          key={source.id}
          className="subscription-item"
        >

          <div>

            <strong>
              💰 {source.name}
            </strong>

            <p>
              ₹
              {Number(
                source.amount
              ).toLocaleString()}
              /month
            </p>

          </div>

          <div className="subscription-actions">

            <strong>
              ₹
              {Number(
                source.amount
              ).toLocaleString()}
            </strong>

            <button
              className="expense-delete"
              onClick={() =>
                deleteIncomeSource(
                  source.id
                )
              }
            >
              🗑️
            </button>

          </div>

        </div>

      ))}

    </div>

  )}

  {/* TOTAL INCOME */}

  <div className="subscription-total">

    <div>

      <span>
        Total monthly income
      </span>

      <strong>
        ₹{income.toLocaleString()}
      </strong>

    </div>

  </div>

</section>

        {/* ADD EXPENSE */}

        <section className="panel">

          <h2>
            ➕ Add Expense
          </h2>

          <div className="input-row">

            <input
              type="text"
              value={newExpense}
              onChange={(e) =>
                setNewExpense(
                  e.target.value
                )
              }
              placeholder="Expense name"
            />

            <input
              type="number"
              value={newAmount}
              onChange={(e) =>
                setNewAmount(
                  e.target.value
                )
              }
              placeholder="Amount ₹"
            />

            <button
              onClick={addExpense}
            >
              Add Expense
            </button>

          </div>

          <p
            style={{
              marginTop:
                "12px",
              color:
                "#667085",
              fontSize:
                "14px",
            }}
          >
            📅 Today's date will
            be automatically added
            to the expense.
          </p>

        </section>

        {/* SPENDING BREAKDOWN */}

        <section className="panel">

          <h2>
            📊 Spending Breakdown
          </h2>

          {expenses.length ===
          0 ? (

            <p>
              No expenses added
              yet.
            </p>

          ) : (

            expenses.map(
              (
                expense,
                index
              ) => {

                const percentage =
                  totalExpenses >
                  0
                    ? (
                        (Number(
                          expense.amount
                        ) /
                          totalExpenses) *
                        100
                      ).toFixed(1)
                    : 0;

                return (

                  <div
                    className="expense-breakdown"
                    key={
                      expense.tripId ||
                      `${expense.name}-${index}`
                    }
                  >

                    <div className="expense-top">

                      <div>

                        <span>
                          {expense.icon ||
                            "💸"}{" "}
                          {expense.name}
                        </span>

                        <div
                          style={{
                            marginTop:
                              "5px",
                            color:
                              "#667085",
                            fontSize:
                              "13px",
                          }}
                        >
                          📅{" "}
                          {formatExpenseDate(
                            expense.date
                          )}
                        </div>

                        {expense.tripId && (

                          <div
                            style={{
                              marginTop:
                                "4px",
                              color:
                                "#667085",
                              fontSize:
                                "12px",
                            }}
                          >
                            ✈️ Trip expense
                          </div>

                        )}

                      </div>

                      <div className="expense-actions">

                        <strong>
                          ₹
                          {Number(
                            expense.amount
                          ).toLocaleString()}
                        </strong>

                        {!expense.tripId && (

                          <button
                            className="expense-delete"
                            onClick={() =>
                              deleteExpense(
                                index
                              )
                            }
                          >
                            🗑️
                          </button>

                        )}

                      </div>

                    </div>

                    <div className="expense-bar">

                      <div
                        className="expense-progress"
                        style={{
                          width:
                            `${percentage}%`,
                        }}
                      ></div>

                    </div>

                    <p className="expense-percentage">
                      {percentage}% of total
                      spending
                    </p>

                  </div>

                );
              }
            )

          )}

        </section>

        {/* SUBSCRIPTION MANAGER */}

        <section className="panel">

          <h2>
            📱 Subscription Manager
          </h2>

          <p>
            Track recurring
            subscriptions and
            understand their
            yearly cost.
          </p>

          <div className="input-row">

            <input
              type="text"
              value={
                newSubscription
              }
              onChange={(e) =>
                setNewSubscription(
                  e.target.value
                )
              }
              placeholder="Subscription name"
            />

            <input
              type="number"
              value={
                newSubscriptionAmount
              }
              onChange={(e) =>
                setNewSubscriptionAmount(
                  e.target.value
                )
              }
              placeholder="Monthly cost ₹"
            />

            <button
              onClick={
                addSubscription
              }
            >
              + Add Subscription
            </button>

          </div>

          {subscriptions.length ===
          0 ? (

            <p>
              No subscriptions
              added yet.
            </p>

          ) : (

            subscriptions.map(
              (
                subscription,
                index
              ) => (

                <div
                  className="subscription-item"
                  key={index}
                >

                  <div>

                    <strong>
                      🔄{" "}
                      {
                        subscription.name
                      }
                    </strong>

                    <p>
                      ₹
                      {Number(
                        subscription.amount
                      ).toLocaleString()}
                      /month
                    </p>

                  </div>

                  <div className="subscription-actions">

                    <span>
                      ₹
                      {(
                        Number(
                          subscription.amount
                        ) * 12
                      ).toLocaleString()}
                      /year
                    </span>

                    <button
                      className="expense-delete"
                      onClick={() =>
                        deleteSubscription(
                          index
                        )
                      }
                    >
                      🗑️
                    </button>

                  </div>

                </div>

              )
            )

          )}

          <div className="subscription-total">

            <div>

              <span>
                Monthly subscriptions
              </span>

              <strong>
                ₹
                {totalSubscriptionMonthly.toLocaleString()}
              </strong>

            </div>

            <div>

              <span>
                Yearly subscriptions
              </span>

              <strong>
                ₹
                {totalSubscriptionYearly.toLocaleString()}
              </strong>

            </div>

          </div>

        </section>

        {/* EMI MANAGER */}

        <section className="panel">

          <h2>
            🏦 EMI Manager
          </h2>

          <p>
            Track your total loan amount, payments, remaining balance, monthly EMI and due dates.
          </p>

          <div className="input-row">

            <input
              type="text"
              value={newEmiName}
              onChange={(e) =>
                setNewEmiName(e.target.value)
              }
              placeholder="EMI name (e.g. Car Loan)"
            />

            <input
              type="number"
              min="1"
              value={newEmiTotalAmount}
              onChange={(e) =>
                setNewEmiTotalAmount(e.target.value)
              }
              placeholder="Total loan amount ₹"
            />

            <input
              type="number"
              min="1"
              value={newEmiAmount}
              onChange={(e) =>
                setNewEmiAmount(e.target.value)
              }
              placeholder="Monthly EMI ₹"
            />

            <input
              type="number"
              min="0"
              value={newEmiPaidAmount}
              onChange={(e) =>
                setNewEmiPaidAmount(e.target.value)
              }
              placeholder="Already paid ₹"
            />

            <input
              type="number"
              min="1"
              max="31"
              value={newEmiDueDay}
              onChange={(e) =>
                setNewEmiDueDay(e.target.value)
              }
              placeholder="Due day (1-31)"
            />

            <button onClick={addEmi}>
              + Add EMI
            </button>

          </div>

          {emis.length === 0 ? (

            <p>
              No EMIs added yet.
            </p>

          ) : (

            emis.map((emi) => {
              const totalAmount = getEmiTotalAmount(emi);
              const paidAmount = getEmiPaidAmount(emi);
              const remainingAmount = getEmiRemainingAmount(emi);
              const remainingInstallments = getEmiRemainingInstallments(emi);
              const paidPercentage =
                totalAmount > 0
                  ? Math.min(100, (paidAmount / totalAmount) * 100)
                  : 0;
              const dueDate = getNextEmiDueDate(emi);
              const daysRemaining = getDaysUntilEmi(dueDate);
              const isCompleted = remainingAmount <= 0;

              let completionDate = null;
              if (!isCompleted && remainingInstallments > 0) {
                completionDate = new Date(dueDate);
                completionDate.setMonth(
                  completionDate.getMonth() + remainingInstallments - 1
                );
              }

              return (

                <div
                  className="subscription-item"
                  key={emi.id}
                  style={{
                    display: "block",
                    marginBottom: "18px",
                  }}
                >

                  <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-start" }}>

                    <div>
                      <strong>
                        🏦 {emi.name}
                      </strong>

                      <p>
                        Total loan: ₹{totalAmount.toLocaleString()}
                      </p>

                      <p>
                        Monthly EMI: ₹{Number(emi.monthlyAmount).toLocaleString()}
                      </p>

                      <p>
                        Paid: ₹{paidAmount.toLocaleString()}
                      </p>

                      <p>
                        Remaining: ₹{remainingAmount.toLocaleString()}
                      </p>

                      <p>
                        Remaining EMIs: {remainingInstallments}
                      </p>

                      {!isCompleted && (
                        <p>
                          📅 Due: {formatEmiDueDate(dueDate)}
                        </p>
                      )}

                      {!isCompleted && completionDate && (
                        <p>
                          🏁 Estimated completion: {formatEmiDueDate(completionDate)}
                        </p>
                      )}

                      {isCompleted && (
                        <p>
                          🎉 EMI fully paid
                        </p>
                      )}
                    </div>

                    <div className="subscription-actions" style={{ flexDirection: "column", alignItems: "flex-end" }}>

                      {!isCompleted && (
                        <span>
                          {daysRemaining < 0
                            ? `🔴 ${Math.abs(daysRemaining)} days overdue`
                            : daysRemaining === 0
                            ? "🔴 Due today"
                            : daysRemaining === 1
                            ? "🟠 1 day remaining"
                            : `🟢 ${daysRemaining} days remaining`}
                        </span>
                      )}

                      <button
                        onClick={() => recordEmiPayment(emi.id)}
                        disabled={isCompleted}
                      >
                        {isCompleted ? "✓ Completed" : `✓ Mark ₹${Math.min(Number(emi.monthlyAmount) || 0, remainingAmount).toLocaleString()} Paid`}
                      </button>

                      <button
                        className="expense-delete"
                        onClick={() => deleteEmi(emi.id)}
                      >
                        🗑️
                      </button>

                    </div>

                  </div>

                  <div style={{ marginTop: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                      <span>Payment progress</span>
                      <strong>{paidPercentage.toFixed(0)}%</strong>
                    </div>
                    <div style={{ height: "10px", background: "#e5e7eb", borderRadius: "999px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${paidPercentage}%`,
                          height: "100%",
                          background: "#667eea",
                          borderRadius: "999px",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                  </div>

                  {Array.isArray(emi.paymentHistory) && emi.paymentHistory.length > 0 && (
                    <div style={{ marginTop: "14px" }}>
                      <strong>Payment history</strong>
                      {emi.paymentHistory
                        .slice()
                        .reverse()
                        .slice(0, 5)
                        .map((payment) => (
                          <p key={payment.id} style={{ margin: "6px 0", fontSize: "13px" }}>
                            ₹{Number(payment.amount).toLocaleString()} paid on {formatEmiDueDate(new Date(payment.date))}
                          </p>
                        ))}
                    </div>
                  )}

                </div>

              );
            })

          )}

          {emis.length > 0 && (

            <div className="subscription-total">

              <div>
                <span>Total monthly EMIs</span>
                <strong>₹{totalEmiMonthly.toLocaleString()}</strong>
              </div>

              <div>
                <span>Total paid across loans</span>
                <strong>₹{totalEmiPaid.toLocaleString()}</strong>
              </div>

              <div>
                <span>Total remaining across loans</span>
                <strong>₹{totalEmiRemaining.toLocaleString()}</strong>
              </div>

            </div>

          )}

        </section>

        {/* =========================
            TRIP EXPENSE MANAGER
            ========================= */}

        <section className="panel">

          <h2>
            ✈️ Trip Expenses
          </h2>

          <p>
            Create a trip and track
            every expense separately.
            The trip total is automatically
            included in your main expenses.
          </p>

          {/* CREATE TRIP */}

          <div className="input-row">

            <input
              type="text"
              value={newTripName}
              onChange={(e) =>
                setNewTripName(
                  e.target.value
                )
              }
              placeholder="Trip name"
            />

            <input
              type="text"
              value={newTripDestination}
              onChange={(e) =>
                setNewTripDestination(
                  e.target.value
                )
              }
              placeholder="Destination"
            />

          </div>

          <div className="input-row">

            <input
              type="date"
              value={
                newTripStartDate
              }
              onChange={(e) =>
                setNewTripStartDate(
                  e.target.value
                )
              }
            />

            <input
              type="date"
              value={
                newTripEndDate
              }
              onChange={(e) =>
                setNewTripEndDate(
                  e.target.value
                )
              }
            />

            <button
              onClick={addTrip}
            >
              ✈️ Create Trip
            </button>

          </div>

          {/* TRIP LIST */}

          {trips.length === 0 ? (

            <div
              style={{
                marginTop:
                  "20px",
                padding:
                  "20px",
                borderRadius:
                  "14px",
                background:
                  "#f8fafc",
                textAlign:
                  "center",
              }}
            >

              <p>
                No trips created yet.
              </p>

              <p
                style={{
                  color:
                    "#667085",
                  fontSize:
                    "14px",
                }}
              >
                Create your first trip
                above to start tracking
                travel expenses.
              </p>

            </div>

          ) : (

            <div
              style={{
                marginTop:
                  "20px",
              }}
            >

              {trips.map(
                (trip) => {

                  const tripTotal =
                    getTripTotal(
                      trip
                    );

                  const isSelected =
                    selectedTripId ===
                    trip.id;

                  return (

                    <div
                      key={trip.id}
                      style={{
                        marginBottom:
                          "16px",
                        border:
                          isSelected
                            ? "2px solid #667eea"
                            : "1px solid #e4e7ec",
                        borderRadius:
                          "16px",
                        padding:
                          "18px",
                        background:
                          "#ffffff",
                        boxShadow:
                          "0 4px 14px rgba(0,0,0,0.05)",
                      }}
                    >

                      {/* TRIP HEADER */}

                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "flex-start",
                          gap:
                            "12px",
                        }}
                      >

                        <div
                          onClick={() =>
                            setSelectedTripId(
                              isSelected
                                ? null
                                : trip.id
                            )
                          }
                          style={{
                            cursor:
                              "pointer",
                            flex:
                              1,
                          }}
                        >

                          <h3
                            style={{
                              margin:
                                "0 0 6px",
                            }}
                          >
                            ✈️{" "}
                            {trip.name}
                          </h3>

                          {trip.destination && (

                            <p
                              style={{
                                margin:
                                  "4px 0",
                                color:
                                  "#667085",
                              }}
                            >
                              📍{" "}
                              {
                                trip.destination
                              }
                            </p>

                          )}

                          <p
                            style={{
                              margin:
                                "4px 0",
                              color:
                                "#667085",
                              fontSize:
                                "13px",
                            }}
                          >
                            📅{" "}
                            {formatExpenseDate(
                              trip.startDate
                            )}{" "}
                            →{" "}
                            {formatExpenseDate(
                              trip.endDate
                            )}
                          </p>

                        </div>

                        <div
                          style={{
                            textAlign:
                              "right",
                          }}
                        >

                          <strong
                            style={{
                              display:
                                "block",
                              fontSize:
                                "20px",
                            }}
                          >
                            ₹
                            {tripTotal.toLocaleString()}
                          </strong>

                          <span
                            style={{
                              color:
                                "#667085",
                              fontSize:
                                "12px",
                            }}
                          >
                            {trip.expenses.length}{" "}
                            expense
                            {trip.expenses.length !==
                            1
                              ? "s"
                              : ""}
                          </span>

                        </div>

                      </div>

                      {/* TRIP ACTIONS */}

                      <div
                        style={{
                          display:
                            "flex",
                          gap:
                            "8px",
                          marginTop:
                            "14px",
                        }}
                      >

                        <button
                          onClick={() =>
                            setSelectedTripId(
                              isSelected
                                ? null
                                : trip.id
                            )
                          }
                        >
                          {isSelected
                            ? "▲ Hide Details"
                            : "▼ View Details"}
                        </button>

                        <button
                          className="expense-delete"
                          onClick={() =>
                            deleteTrip(
                              trip.id
                            )
                          }
                        >
                          🗑️ Delete Trip
                        </button>

                      </div>

                      {/* TRIP DETAILS */}

                      {isSelected && (

                        <div
                          style={{
                            marginTop:
                              "18px",
                            paddingTop:
                              "18px",
                            borderTop:
                              "1px solid #e4e7ec",
                          }}
                        >

                          <h4>
                            💸 Add Trip Expense
                          </h4>

                          <div className="input-row">

                            <input
                              type="text"
                              value={
                                newTripExpenseName
                              }
                              onChange={(e) =>
                                setNewTripExpenseName(
                                  e.target.value
                                )
                              }
                              placeholder="Expense name"
                            />

                            <input
                              type="number"
                              value={
                                newTripExpenseAmount
                              }
                              onChange={(e) =>
                                setNewTripExpenseAmount(
                                  e.target.value
                                )
                              }
                              placeholder="Amount ₹"
                            />

                            <button
                              onClick={() =>
                                addTripExpense(
                                  trip.id
                                )
                              }
                            >
                              + Add Expense
                            </button>

                          </div>

                          {/* EXPENSE DETAILS */}

                          {trip.expenses.length ===
                          0 ? (

                            <p
                              style={{
                                color:
                                  "#667085",
                                marginTop:
                                  "16px",
                              }}
                            >
                              No expenses added
                              to this trip yet.
                            </p>

                          ) : (

                            <div
                              style={{
                                marginTop:
                                  "16px",
                              }}
                            >

                              {trip.expenses.map(
                                (
                                  tripExpense
                                ) => {

                                  const expensePercentage =
                                    tripTotal >
                                    0
                                      ? (
                                          (Number(
                                            tripExpense.amount
                                          ) /
                                            tripTotal) *
                                          100
                                        ).toFixed(
                                          1
                                        )
                                      : 0;

                                  return (

                                    <div
                                      key={
                                        tripExpense.id
                                      }
                                      style={{
                                        padding:
                                          "14px",
                                        marginBottom:
                                          "10px",
                                        borderRadius:
                                          "12px",
                                        background:
                                          "#f8fafc",
                                      }}
                                    >

                                      <div
                                        style={{
                                          display:
                                            "flex",
                                          justifyContent:
                                            "space-between",
                                          alignItems:
                                            "center",
                                        }}
                                      >

                                        <div>

                                          <strong>
                                            💸{" "}
                                            {
                                              tripExpense.name
                                            }
                                          </strong>

                                          <p
                                            style={{
                                              margin:
                                                "4px 0 0",
                                              color:
                                                "#667085",
                                              fontSize:
                                                "12px",
                                            }}
                                          >
                                            📅{" "}
                                            {formatExpenseDate(
                                              tripExpense.date
                                            )}
                                          </p>

                                        </div>

                                        <div
                                          style={{
                                            display:
                                              "flex",
                                            alignItems:
                                              "center",
                                            gap:
                                              "10px",
                                          }}
                                        >

                                          <strong>
                                            ₹
                                            {Number(
                                              tripExpense.amount
                                            ).toLocaleString()}
                                          </strong>

                                          <button
                                            className="expense-delete"
                                            onClick={() =>
                                              deleteTripExpense(
                                                trip.id,
                                                tripExpense.id
                                              )
                                            }
                                          >
                                            🗑️
                                          </button>

                                        </div>

                                      </div>

                                      <div
                                        className="expense-bar"
                                        style={{
                                          marginTop:
                                            "10px",
                                        }}
                                      >

                                        <div
                                          className="expense-progress"
                                          style={{
                                            width:
                                              `${expensePercentage}%`,
                                          }}
                                        ></div>

                                      </div>

                                      <p
                                        className="expense-percentage"
                                      >
                                        {
                                          expensePercentage
                                        }%
                                        {" "}of trip
                                        spending
                                      </p>

                                    </div>

                                  );
                                }
                              )}

                              {/* TRIP TOTAL */}

                              <div
                                className="subscription-total"
                                style={{
                                  marginTop:
                                    "16px",
                                }}
                              >

                                <div>

                                  <span>
                                    Total trip expenses
                                  </span>

                                  <strong>
                                    ₹
                                    {tripTotal.toLocaleString()}
                                  </strong>

                                </div>

                              </div>

                              <p
                                style={{
                                  marginTop:
                                    "12px",
                                  color:
                                    "#667085",
                                  fontSize:
                                    "13px",
                                }}
                              >
                                💡 This total is
                                automatically included
                                in your main spending
                                breakdown.
                              </p>

                            </div>

                          )}

                        </div>

                      )}

                    </div>

                  );

                }

              )}

            </div>

          )}

        </section>

        {/* PREVIOUS SAVINGS */}

        <section className="panel">

          <h2>
            💰 Previous Savings
          </h2>

          <p>
            Savings carried forward from
            the previous month.
          </p>

          <div className="what-if-result">

            <div className="what-if-row">

              <span>
                Previous month savings
              </span>

              <strong>
                ₹
                {previousSavings.toLocaleString()}
              </strong>

            </div>

            <div className="what-if-row">

              <span>
                This month's savings
              </span>

              <strong>
                ₹
                {monthlySavings.toLocaleString()}
              </strong>

            </div>

            <div className="what-if-row">

              <span>
                Total savings
              </span>

              <strong>
                ₹
                {totalSavings.toLocaleString()}
              </strong>

            </div>

          </div>

        </section>

        {/* FINANCIAL GOALS */}

<section className="panel">

  <h2>
    🎯 Financial Goals
  </h2>

  <div className="input-row">

    <input
      type="text"
      value={newGoalName}
      onChange={(e) =>
        setNewGoalName(e.target.value)
      }
      placeholder="Goal name"
    />

    <input
      type="number"
      value={newGoalTarget}
      onChange={(e) =>
        setNewGoalTarget(e.target.value)
      }
      placeholder="Target ₹"
    />

    <input
      type="number"
      value={totalSavings}
      readOnly
      placeholder="Current savings ₹"
    />

    <button onClick={addGoal}>
      + Add Goal
    </button>

  </div>

  {goals.map((goal, index) => {

    // Always use the latest FinGlass savings
    const currentSavings = totalSavings;

    // Amount still needed
    const remaining = Math.max(
      Number(goal.target) - currentSavings,
      0
    );

    // Goal progress percentage
    const progress =
      Number(goal.target) > 0
        ? Math.min(
            (currentSavings / Number(goal.target)) * 100,
            100
          )
        : 0;

    // Estimated months to reach goal
    const months =
      remaining === 0
        ? 0
        : monthlySavings > 0
        ? (remaining / monthlySavings).toFixed(1)
        : "—";

    return (
      <div
        className="goal-info"
        key={goal.id || index}
      >

        <div className="goal-header">

          <h3>
            🎯 {goal.name}
          </h3>

          <button
            className="goal-delete"
            onClick={() => deleteGoal(index)}
          >
            🗑️
          </button>

        </div>

        {/* CURRENT SAVINGS */}

        <p>
          ₹{currentSavings.toLocaleString()} saved of ₹
          {Number(goal.target).toLocaleString()}
        </p>

        {/* PROGRESS BAR */}

        <div className="progress-bar">

          <div
            className="progress"
            style={{
              width: `${progress}%`,
            }}
          ></div>

        </div>

        {/* PROGRESS PERCENTAGE */}

        <p>
          📊 Progress:{" "}
          <strong>
            {progress.toFixed(1)}%
          </strong>
        </p>

        {/* REMAINING */}

        <p>
          {remaining > 0 ? (
            <>
              <strong>
                ₹{remaining.toLocaleString()}
              </strong>{" "}
              more needed
            </>
          ) : (
            <strong>
              🎉 Goal reached!
            </strong>
          )}
        </p>

        {/* ESTIMATED TIME */}

        <p>
          ⏱️ Estimated time:{" "}
          <strong>
            {months === 0
              ? "Goal reached"
              : months === "—"
              ? "—"
              : `${months} months`}
          </strong>
        </p>

      </div>
    );

  })}

</section>
        {/* WHAT-IF SIMULATOR */}

        <section className="panel">

          <h2>
            🧪 What-If Simulator
          </h2>

          <p>
            See how reducing your
            expenses could change
            your savings.
          </p>

          <div className="input-row">

            <input
              type="number"
              value={
                whatIfAmount
              }
              onChange={(e) =>
                setWhatIfAmount(
                  e.target.value
                )
              }
              placeholder="Reduce expenses by ₹"
            />

            <button
              onClick={() =>
                setShowWhatIf(
                  true
                )
              }
            >
              Calculate
            </button>

          </div>

          {showWhatIf &&
            whatIfValue > 0 && (

              <div className="what-if-result">

                <h3>
                  📊 Simulation Result
                </h3>

                <div className="what-if-row">

                  <span>
                    Current monthly
                    savings
                  </span>

                  <strong>
                    ₹
                    {monthlySavings.toLocaleString()}
                  </strong>

                </div>

                <div className="what-if-row">

                  <span>
                    Expense reduction
                  </span>

                  <strong>
                    +₹
                    {whatIfValue.toLocaleString()}
                  </strong>

                </div>

                <div className="what-if-row">

                  <span>
                    New monthly
                    savings
                  </span>

                  <strong>
                    ₹
                    {whatIfNewSavings.toLocaleString()}
                  </strong>

                </div>

                <div className="what-if-row">

                  <span>
                    Yearly improvement
                  </span>

                  <strong>
                    +₹
                    {whatIfYearlyImprovement.toLocaleString()}
                  </strong>

                </div>

                <div className="what-if-reasoning">

                  <span className="badge">
                    GLASS BOX CALCULATION
                  </span>

                  <p>
                    Current savings =
                    ₹
                    {monthlySavings.toLocaleString()}
                  </p>

                  <p>
                    Expense reduction =
                    ₹
                    {whatIfValue.toLocaleString()}
                  </p>

                  <p>
                    New savings =
                    ₹
                    {monthlySavings.toLocaleString()}
                    {" "}+
                    ₹
                    {whatIfValue.toLocaleString()}
                    {" "}=
                    ₹
                    {whatIfNewSavings.toLocaleString()}
                  </p>

                  <p>
                    Yearly improvement =
                    ₹
                    {whatIfValue.toLocaleString()}
                    {" "}× 12 =
                    ₹
                    {whatIfYearlyImprovement.toLocaleString()}
                  </p>

                </div>

              </div>

            )}

        </section>

        {/* METTA GLASS BOX ANALYSIS */}

        <section className="panel">

          <h2>
            🧠 MeTTa Glass Box
            Analysis
          </h2>

          <p>
            Send your current
            financial data to the
            MeTTa reasoning engine.
          </p>

          <button
            onClick={
              runGlassBoxAnalysis
            }
          >
            🧠 Run Glass Box
            Analysis
          </button>

          {glassBoxResult && (

            <div className="agent-response">

              <h3>
                📊 MeTTa Analysis
                Result
              </h3>

              <p>
                <strong>
                  Monthly income:
                </strong>{" "}
                ₹
                {glassBoxResult.income.toLocaleString()}
              </p>

              <p>
                <strong>
                  Total expenses:
                </strong>{" "}
                ₹
                {glassBoxResult.expenses.toLocaleString()}
              </p>

              <p>
                <strong>
                  Monthly savings:
                </strong>{" "}
                ₹
                {glassBoxResult.savings.toLocaleString()}
              </p>

              <p>
                <strong>
                  Savings rate:
                </strong>{" "}
                {glassBoxResult.savings_rate}%
              </p>

              <div className="agent-reasoning">

                <span className="badge">
                  GLASS BOX REASONING
                </span>

                {glassBoxResult.reasoning.map(
                  (
                    step,
                    index
                  ) => (

                    <p
                      key={index}
                    >
                      <strong>
                        {index + 1}.
                      </strong>{" "}
                      {step}
                    </p>

                  )
                )}

              </div>

            </div>

          )}

        </section>

        {/* GLASS BOX INSIGHT */}

        <section className="insight">

          <div>

            <span className="badge">
              GLASS BOX INSIGHT
            </span>

            <h2>
              🔍 Subscription
              spending
            </h2>

            <p>
              You spend ₹
              {Number(
                subscriptionExpense
              ).toLocaleString()}
              every month on
              subscriptions.
              This represents{" "}
              {subscriptionPercentage}%
              of your total monthly
              expenses.
            </p>

          </div>

          <button
            onClick={() =>
              setShowWhy(
                !showWhy
              )
            }
          >
            {showWhy
              ? "Hide reasoning"
              : "Why?"}
          </button>

        </section>

        {/* REASONING */}

        {showWhy && (

          <section className="reasoning">

            <h2>
              🔍 Why this insight?
            </h2>

            <div className="reason">

              <div>1</div>

              <p>
                Subscription expenses =
                ₹
                {Number(
                  subscriptionExpense
                ).toLocaleString()}
                /month
              </p>

            </div>

            <div className="arrow">
              ↓
            </div>

            <div className="reason">

              <div>2</div>

              <p>
                Total monthly
                expenses =
                ₹
                {totalExpenses.toLocaleString()}
              </p>

            </div>

            <div className="arrow">
              ↓
            </div>

            <div className="reason">

              <div>3</div>

              <p>
                Subscriptions
                represent{" "}
                {subscriptionPercentage}%
                of spending
              </p>

            </div>

            <div className="arrow">
              ↓
            </div>

            <div className="reason">

              <div>4</div>

              <p>
                Subscriptions are
                recurring expenses
              </p>

            </div>

            <div className="arrow">
              ↓
            </div>

            <div className="reason final">

              <div>✓</div>

              <p>
                Reviewing recurring
                expenses may create
                an opportunity to
                increase savings.
              </p>

            </div>

          </section>

        )}

        {/* FINANCIAL AGENT */}

        <section className="panel agent-panel">

          <span className="badge">
            🤖 FINANCIAL AGENT
          </span>

          <h2>
            Ask FinGlass
          </h2>

          <p>
            Ask questions about
            your income, expenses,
            savings, subscriptions,
            or financial goals.
          </p>

          <div className="input-row">

            <input
              type="text"
              value={
                agentQuestion
              }
              onChange={(e) =>
                setAgentQuestion(
                  e.target.value
                )
              }
              placeholder="e.g. How can I save more?"
              onKeyDown={(e) => {

                if (
                  e.key ===
                  "Enter"
                ) {
                  askFinancialAgent();
                }

              }}
            />

            <button
              onClick={() =>
                askFinancialAgent()
              }
            >
              Ask Agent
            </button>

          </div>

          <div className="quick-questions">

            <button
              onClick={() => {

                setAgentQuestion(
                  "How can I save more?"
                );

                askFinancialAgent(
                  "How can I save more?"
                );

              }}
            >
              💰 How can I save
              more?
            </button>

            <button
              onClick={() => {

                setAgentQuestion(
                  "What is my biggest expense?"
                );

                askFinancialAgent(
                  "What is my biggest expense?"
                );

              }}
            >
              📊 Biggest expense?
            </button>

            <button
              onClick={() => {

                setAgentQuestion(
                  "How much are my subscriptions?"
                );

                askFinancialAgent(
                  "How much are my subscriptions?"
                );

              }}
            >
              📱 Subscription
              cost?
            </button>

          </div>

          {agentResponse && (

            <div className="agent-response">

              <h3>
                🤖 FinGlass Agent
              </h3>

              <p>
                {agentResponse}
              </p>

              <button
                className="why-button"
                onClick={() =>
                  setShowAgentReasoning(
                    !showAgentReasoning
                  )
                }
              >
                {showAgentReasoning
                  ? "Hide reasoning"
                  : "🔍 Why did you say this?"}
              </button>

              {showAgentReasoning && (

                <div className="agent-reasoning">

                  <span className="badge">
                    GLASS BOX REASONING
                  </span>

                  {agentReasoning.map(
                    (
                      step,
                      index
                    ) => (

                      <p
                        key={index}
                      >
                        <strong>
                          {index + 1}.
                        </strong>{" "}
                        {step}
                      </p>

                    )
                  )}

                  <p className="agent-final">
                    ✓ Reasoning returned
                    by the MeTTa Financial
                    Agent.
                  </p>

                </div>

              )}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default App;