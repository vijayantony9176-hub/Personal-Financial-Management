import { useState } from "react";
import "./App.css";

function App() {
  // =========================
  // FINANCIAL GOALS
  // =========================

  const [goals, setGoals] = useState([
    {
      name: "Emergency Fund",
      target: 50000,
      current: 19000,
    },
  ]);

  // =========================
  // INCOME
  // =========================

  const [income, setIncome] = useState(30000);

  // =========================
  // EXPENSES
  // =========================

  const [expenses, setExpenses] = useState([
    { name: "Food", amount: 5000, icon: "🍔" },
    { name: "Transport", amount: 3000, icon: "🚗" },
    { name: "Bills", amount: 10000, icon: "🏠" },
    { name: "Subscriptions", amount: 2000, icon: "🔄" },
  ]);

  const [newExpense, setNewExpense] = useState("");
  const [newAmount, setNewAmount] = useState("");

  // =========================
  // SUBSCRIPTIONS
  // =========================

  const [subscriptions, setSubscriptions] = useState([
    { name: "Netflix", amount: 649 },
    { name: "Spotify", amount: 119 },
  ]);

  const [newSubscription, setNewSubscription] = useState("");
  const [newSubscriptionAmount, setNewSubscriptionAmount] =
    useState("");

  // =========================
  // NEW GOAL INPUTS
  // =========================

  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [newGoalCurrent, setNewGoalCurrent] = useState("");

  // =========================
  // GLASS BOX
  // =========================

  const [showWhy, setShowWhy] = useState(false);

  // =========================
  // WHAT-IF SIMULATOR
  // =========================

  const [whatIfAmount, setWhatIfAmount] = useState("");
  const [showWhatIf, setShowWhatIf] = useState(false);

  // =========================
// FINANCIAL AGENT
// =========================

const [agentQuestion, setAgentQuestion] = useState("");
const [agentResponse, setAgentResponse] = useState("");
const [showAgentReasoning, setShowAgentReasoning] = useState(false);

  // =========================
  // RESET FINANCIAL DATA
  // =========================

  const resetFinancialData = () => {
    setIncome(0);
    setExpenses([]);
  };

  // =========================
  // CALCULATIONS
  // =========================

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const savings = income - totalExpenses;

  const savingsRate =
    income > 0 ? ((savings / income) * 100).toFixed(1) : 0;

  // =========================
  // WHAT-IF CALCULATIONS
  // =========================

  const whatIfValue = Number(whatIfAmount) || 0;

  const whatIfNewSavings =
    savings + whatIfValue;

  const whatIfYearlyImprovement =
    whatIfValue * 12;

  // =========================
  // ADD GOAL
  // =========================

  const addGoal = () => {
    if (!newGoalName || !newGoalTarget || !newGoalCurrent) return;

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
    setGoals(goals.filter((_, i) => i !== index));
  };

  // =========================
  // ADD EXPENSE
  // =========================

  const addExpense = () => {
    if (!newExpense || !newAmount) return;

    setExpenses([
      ...expenses,
      {
        name: newExpense,
        amount: Number(newAmount),
        icon: "💸",
      },
    ]);

    setNewExpense("");
    setNewAmount("");
  };

  // =========================
  // DELETE EXPENSE
  // =========================

  const deleteExpense = (index) => {
    setExpenses(
      expenses.filter((_, i) => i !== index)
    );
  };

  // =========================
  // ADD SUBSCRIPTION
  // =========================

  const addSubscription = () => {
    if (
      !newSubscription ||
      !newSubscriptionAmount
    )
      return;

    setSubscriptions([
      ...subscriptions,
      {
        name: newSubscription,
        amount: Number(newSubscriptionAmount),
      },
    ]);

    setNewSubscription("");
    setNewSubscriptionAmount("");
  };

  // =========================
  // DELETE SUBSCRIPTION
  // =========================

  const deleteSubscription = (index) => {
    setSubscriptions(
      subscriptions.filter((_, i) => i !== index)
    );
  };

  // =========================
  // SUBSCRIPTION CALCULATIONS
  // =========================

  const totalSubscriptionMonthly =
    subscriptions.reduce(
      (total, subscription) =>
        total + subscription.amount,
      0
    );

  const totalSubscriptionYearly =
    totalSubscriptionMonthly * 12;

  const subscriptionExpense =
    expenses.find(
      (expense) =>
        expense.name.toLowerCase() ===
        "subscriptions"
    )?.amount || 0;

  const subscriptionPercentage =
    totalExpenses > 0
      ? (
          (subscriptionExpense / totalExpenses) *
          100
        ).toFixed(1)
      : 0;

  // =========================
// FINANCIAL AGENT LOGIC
// =========================

const getLargestExpense = () => {
  if (expenses.length === 0) {
    return {
      name: "No expenses",
      amount: 0,
    };
  }

  return expenses.reduce((largest, expense) =>
    expense.amount > largest.amount
      ? expense
      : largest
  );
};

const askFinancialAgent = () => {
  const question = agentQuestion.toLowerCase();

  let response = "";

  if (
    question.includes("save") ||
    question.includes("saving")
  ) {
    response =
      `Your current monthly savings are ₹${savings.toLocaleString()}. ` +
      `Your savings rate is ${savingsRate}%. ` +
      `Your largest expense is ${getLargestExpense().name} ` +
      `at ₹${getLargestExpense().amount.toLocaleString()}.`;
  } else if (
    question.includes("expense") ||
    question.includes("spend") ||
    question.includes("spending")
  ) {
    const largest = getLargestExpense();

    response =
      `Your total monthly expenses are ₹${totalExpenses.toLocaleString()}. ` +
      `Your largest expense is ${largest.name} ` +
      `at ₹${largest.amount.toLocaleString()}.`;
  } else if (
    question.includes("subscription")
  ) {
    response =
      `You currently have ${subscriptions.length} subscriptions ` +
      `costing ₹${totalSubscriptionMonthly.toLocaleString()} per month ` +
      `or ₹${totalSubscriptionYearly.toLocaleString()} per year.`;
  } else if (
    question.includes("goal")
  ) {
    response =
      goals.length > 0
        ? `You currently have ${goals.length} financial goal(s). ` +
          `Your first goal is "${goals[0].name}" with ` +
          `₹${Math.max(
            goals[0].target - goals[0].current,
            0
          ).toLocaleString()} remaining.`
        : "You don't have any financial goals yet.";
  } else {
    response =
      `I can analyze your income, expenses, savings, subscriptions, ` +
      `and financial goals. Try asking "How can I save more?"`;
  }

  setAgentResponse(response);
  setShowAgentReasoning(false);
};


// =========================
// UI
// =========================

return (
    <div className="app">

      {/* HEADER */}

      <header>
        <div>
          <h1>💰 FinGlass</h1>
          <p>Your money, explained.</p>
        </div>
      </header>

      <main>

        {/* WELCOME */}

        <section className="welcome">
          <h2>Financial Overview</h2>
          <p>
            Understand where your money goes.
          </p>
        </section>

        {/* DELETE FINANCIAL DATA */}

        <button
          className="delete-btn"
          onClick={resetFinancialData}
        >
          🗑️ Delete Financial Data
        </button>

        {/* DASHBOARD CARDS */}

        <section className="cards">

          <div className="card">
            <span>Monthly Income</span>
            <h2>
              ₹{income.toLocaleString()}
            </h2>
          </div>

          <div className="card">
            <span>Total Expenses</span>
            <h2>
              ₹{totalExpenses.toLocaleString()}
            </h2>
          </div>

          <div className="card">
            <span>Monthly Savings</span>
            <h2>
              ₹{savings.toLocaleString()}
            </h2>
          </div>

          <div className="card">
            <span>Savings Rate</span>
            <h2>
              {savingsRate}%
            </h2>
          </div>

        </section>

        {/* INCOME */}

        <section className="panel">

          <h2>💵 Monthly Income</h2>

          <div className="input-row">

            <input
              type="number"
              value={income}
              onChange={(e) =>
                setIncome(
                  Number(e.target.value)
                )
              }
              placeholder="Enter income"
            />

          </div>

        </section>

        {/* ADD EXPENSE */}

        <section className="panel">

          <h2>➕ Add Expense</h2>

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

            <button onClick={addExpense}>
              Add Expense
            </button>

          </div>

        </section>

        {/* SPENDING BREAKDOWN */}

        <section className="panel">

          <h2>📊 Spending Breakdown</h2>

          {expenses.length === 0 ? (

            <p>
              No expenses added yet.
            </p>

          ) : (

            expenses.map(
              (expense, index) => {

                const percentage =
                  totalExpenses > 0
                    ? (
                        (expense.amount /
                          totalExpenses) *
                        100
                      ).toFixed(1)
                    : 0;

                return (

                  <div
                    className="expense-breakdown"
                    key={index}
                  >

                    <div className="expense-top">

                      <span>
                        {expense.icon}{" "}
                        {expense.name}
                      </span>

                      <div className="expense-actions">

                        <strong>
                          ₹
                          {expense.amount.toLocaleString()}
                        </strong>

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
                      {percentage}%
                      {" "}of total spending
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
            Track recurring subscriptions
            and understand their yearly cost.
          </p>

          {/* ADD SUBSCRIPTION */}

          <div className="input-row">

            <input
              type="text"
              value={newSubscription}
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
              onClick={addSubscription}
            >
              + Add Subscription
            </button>

          </div>

          {/* SUBSCRIPTION LIST */}

          {subscriptions.length === 0 ? (

            <p>
              No subscriptions added yet.
            </p>

          ) : (

            subscriptions.map(
              (subscription, index) => (

                <div
                  className="subscription-item"
                  key={index}
                >

                  <div>

                    <strong>
                      🔄{" "}
                      {subscription.name}
                    </strong>

                    <p>
                      ₹
                      {subscription.amount.toLocaleString()}
                      /month
                    </p>

                  </div>

                  <div className="subscription-actions">

                    <span>
                      ₹
                      {(
                        subscription.amount *
                        12
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

          {/* SUBSCRIPTION TOTAL */}

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

        {/* FINANCIAL GOALS */}

        <section className="panel">

          <h2>
            🎯 Financial Goals
          </h2>

          {/* ADD NEW GOAL */}

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

            <button onClick={addGoal}>
              + Add Goal
            </button>

          </div>

          {/* DISPLAY ALL GOALS */}

          {goals.map(
            (goal, index) => {

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
                savings > 0
                  ? (
                      remaining /
                      savings
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
                    {goal.current.toLocaleString()}
                    {" "}saved of{" "}
                    ₹
                    {goal.target.toLocaleString()}
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

          <h2>🧪 What-If Simulator</h2>

          <p>
            See how reducing your expenses could
            change your savings.
          </p>

          <div className="input-row">

            <input
              type="number"
              value={whatIfAmount}
              onChange={(e) =>
                setWhatIfAmount(e.target.value)
              }
              placeholder="Reduce expenses by ₹"
            />

            <button
              onClick={() => setShowWhatIf(true)}
            >
              Calculate
            </button>

          </div>

          {showWhatIf && whatIfValue > 0 && (

            <div className="what-if-result">

              <h3>📊 Simulation Result</h3>

              <div className="what-if-row">
                <span>
                  Current monthly savings
                </span>

                <strong>
                  ₹{savings.toLocaleString()}
                </strong>
              </div>

              <div className="what-if-row">
                <span>
                  Expense reduction
                </span>

                <strong>
                  +₹{whatIfValue.toLocaleString()}
                </strong>
              </div>

              <div className="what-if-row">
                <span>
                  New monthly savings
                </span>

                <strong>
                  ₹{whatIfNewSavings.toLocaleString()}
                </strong>
              </div>

              <div className="what-if-row">
                <span>
                  Yearly improvement
                </span>

                <strong>
                  +₹{whatIfYearlyImprovement.toLocaleString()}
                </strong>
              </div>

              <div className="what-if-reasoning">

                <span className="badge">
                  GLASS BOX CALCULATION
                </span>

                <p>
                  Current savings =
                  ₹{savings.toLocaleString()}
                </p>

                <p>
                  Expense reduction =
                  ₹{whatIfValue.toLocaleString()}
                </p>

                <p>
                  New savings =
                  ₹{savings.toLocaleString()} +
                  ₹{whatIfValue.toLocaleString()} =
                  ₹{whatIfNewSavings.toLocaleString()}
                </p>

                <p>
                  Yearly improvement =
                  ₹{whatIfValue.toLocaleString()} × 12 =
                  ₹{whatIfYearlyImprovement.toLocaleString()}
                </p>

              </div>

            </div>

          )}

        </section>

        {/* GLASS BOX */}

        <section className="insight">

          <div>

            <span className="badge">
              GLASS BOX INSIGHT
            </span>

            <h2>
              🔍 Subscription spending
            </h2>

            <p>
              You spend ₹
              {subscriptionExpense.toLocaleString()}
              every month on subscriptions.
              This represents{" "}
              {subscriptionPercentage}%
              of your total monthly
              expenses.
            </p>

          </div>

          <button
            onClick={() =>
              setShowWhy(!showWhy)
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
                {subscriptionExpense.toLocaleString()}
                /month
              </p>

            </div>

            <div className="arrow">
              ↓
            </div>

            <div className="reason">

              <div>2</div>

              <p>
                Total monthly expenses =
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
                Subscriptions represent{" "}
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
                Subscriptions are recurring
                expenses
              </p>

            </div>

            <div className="arrow">
              ↓
            </div>

            <div className="reason final">

              <div>✓</div>

              <p>
                Reviewing recurring expenses
                may create an opportunity to
                increase savings.
              </p>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default App;