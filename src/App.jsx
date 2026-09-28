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
  // INCOME
  // =========================

  const [income, setIncome] = useState(() => {
    const saved = localStorage.getItem("finglass_income");

    return saved !== null ? Number(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem("finglass_income", income);
  }, [income]);

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

    return saved ? JSON.parse(saved) : [];
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
  // NEW GOAL INPUTS
  // =========================

  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [newGoalCurrent, setNewGoalCurrent] = useState("");

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
    setIncome(0);
    setExpenses([]);
    setSubscriptions([]);
    setTrips([]);
    setSelectedTripId(null);

    localStorage.setItem(
      "finglass_income",
      "0"
    );

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
    setIncome(0);
    setExpenses([]);
    setGoals([]);
    setSubscriptions([]);
    setTrips([]);
    setSelectedTripId(null);
    setHistory([]);
    setPreviousSavings(0);
    setCurrentMonth(getCurrentMonth());

    localStorage.removeItem("finglass_income");
    localStorage.removeItem("finglass_expenses");
    localStorage.removeItem("finglass_goals");
    localStorage.removeItem("finglass_subscriptions");
    localStorage.removeItem("finglass_trips");
    localStorage.removeItem("finglass_history");
    localStorage.removeItem("finglass_previous_savings");

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
      expenses,
      subscriptions,
      goals,
      trips,
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

        if (
          typeof data.income !== "number" ||
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

        setIncome(data.income);
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
    if (
      !newGoalName ||
      !newGoalTarget ||
      !newGoalCurrent
    ) {
      return;
    }

    setGoals([
      ...goals,
      {
        name: newGoalName,
        target: Number(newGoalTarget),
        current: Number(newGoalCurrent),
      },
    ]);

    setNewGoalName("");
    setNewGoalTarget("");
    setNewGoalCurrent("");
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

    setSubscriptions([
      ...subscriptions,
      {
        name:
          newSubscription,
        amount:
          Number(
            newSubscriptionAmount
          ),
      },
    ]);

    setNewSubscription("");
    setNewSubscriptionAmount("");
  };

  // =========================
  // DELETE SUBSCRIPTION
  // =========================

  const deleteSubscription = (
    index
  ) => {
    setSubscriptions(
      subscriptions.filter(
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
        Number(
          subscription.amount
        ),
      0
    );

  const totalSubscriptionYearly =
    totalSubscriptionMonthly * 12;

  const subscriptionExpense =
    expenses.find(
      (expense) =>
        expense.name
          .toLowerCase() ===
        "subscriptions"
    )?.amount || 0;

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
          "http://127.0.0.1:8000/agent",
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
            "http://127.0.0.1:8000/reason",
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

        {/* INCOME */}

        <section className="panel">

          <h2>
            💵 Monthly Income
          </h2>

          <p>
            Income for{" "}
            <strong>
              {formatMonth(
                currentMonth
              )}
            </strong>
          </p>

          <div className="input-row">

            <input
              type="number"
              value={income}
              onChange={(e) =>
                setIncome(
                  Number(
                    e.target.value
                  )
                )
              }
              placeholder="Enter income"
            />

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
                setNewGoalName(
                  e.target.value
                )
              }
              placeholder="Goal name"
            />

            <input
              type="number"
              value={newGoalTarget}
              onChange={(e) =>
                setNewGoalTarget(
                  e.target.value
                )
              }
              placeholder="Target ₹"
            />

            <input
              type="number"
              value={newGoalCurrent}
              onChange={(e) =>
                setNewGoalCurrent(
                  e.target.value
                )
              }
              placeholder="Current savings ₹"
            />

            <button
              onClick={addGoal}
            >
              + Add Goal
            </button>

          </div>

          {goals.map(
            (
              goal,
              index
            ) => {

              const remaining =
                Math.max(
                  goal.target -
                    goal.current,
                  0
                );

              const progress =
                goal.target > 0
                  ? Math.min(
                      (goal.current /
                        goal.target) *
                        100,
                      100
                    )
                  : 0;

              const months =
                monthlySavings >
                0
                  ? (
                      remaining /
                      monthlySavings
                    ).toFixed(1)
                  : "—";

              return (

                <div
                  className="goal-info"
                  key={index}
                >

                  <div className="goal-header">

                    <h3>
                      🎯{" "}
                      {goal.name}
                    </h3>

                    <button
                      className="goal-delete"
                      onClick={() =>
                        deleteGoal(
                          index
                        )
                      }
                    >
                      🗑️
                    </button>

                  </div>

                  <p>
                    ₹
                    {Number(
                      goal.current
                    ).toLocaleString()}
                    {" "}saved of{" "}
                    ₹
                    {Number(
                      goal.target
                    ).toLocaleString()}
                  </p>

                  <div className="progress-bar">

                    <div
                      className="progress"
                      style={{
                        width:
                          `${progress}%`,
                      }}
                    ></div>

                  </div>

                  <p>
                    <strong>
                      ₹
                      {remaining.toLocaleString()}
                    </strong>
                    {" "}remaining
                  </p>

                  <p>
                    Estimated time:{" "}
                    <strong>
                      {months} months
                    </strong>
                  </p>

                </div>

              );
            }
          )}

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