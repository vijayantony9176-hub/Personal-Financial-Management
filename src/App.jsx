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

  const [glassBoxResult, setGlassBoxResult] = useState(null);

  // =========================
// FINANCIAL AGENT
// =========================

const [agentQuestion, setAgentQuestion] = useState("");
const [agentResponse, setAgentResponse] = useState("");
const [showAgentReasoning, setShowAgentReasoning] = useState(false);
const [agentReasoning, setAgentReasoning] = useState([]);

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

const askFinancialAgent = async (questionText = agentQuestion) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  question: questionText,
  income: income,
  expenses: expenses,
  subscriptions: subscriptions,
}),
    });

    if (!response.ok) {
      throw new Error("Financial Agent request failed");
    }

    const data = await response.json();

    setAgentResponse(data.answer);
setAgentReasoning(data.reasoning || []);
setShowAgentReasoning(false);

  } catch (error) {
    console.error("Financial Agent connection error:", error);

    setAgentResponse(
      "Unable to connect to the FinGlass Financial Agent. Make sure the FastAPI backend is running."
    );

    setShowAgentReasoning(false);
  }
};


// =========================
// UI
// =========================
const runGlassBoxAnalysis = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/reason", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        income: income,
        expenses: expenses,
      }),
    });

    const data = await response.json();

setGlassBoxResult(data);

  } catch (error) {
    console.error("Glass Box connection error:", error);
  }
};
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


        {/* METTA GLASS BOX ANALYSIS */}

<section className="panel">

  <h2>🧠 MeTTa Glass Box Analysis</h2>

  <p>
    Send your current financial data to the
    MeTTa reasoning engine.
  </p>

  <button onClick={runGlassBoxAnalysis}>
    🧠 Run Glass Box Analysis
  </button>

  {glassBoxResult && (
    <div className="agent-response">

      <h3>📊 MeTTa Analysis Result</h3>

      <p>
        <strong>Monthly income:</strong>{" "}
        ₹{glassBoxResult.income.toLocaleString()}
      </p>

      <p>
        <strong>Total expenses:</strong>{" "}
        ₹{glassBoxResult.expenses.toLocaleString()}
      </p>

      <p>
        <strong>Monthly savings:</strong>{" "}
        ₹{glassBoxResult.savings.toLocaleString()}
      </p>

      <p>
        <strong>Savings rate:</strong>{" "}
        {glassBoxResult.savings_rate}%
      </p>

      <div className="agent-reasoning">

        <span className="badge">
          GLASS BOX REASONING
        </span>

        {glassBoxResult.reasoning.map(
          (step, index) => (
            <p key={index}>
              <strong>{index + 1}.</strong>{" "}
              {step}
            </p>
          )
        )}

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

        {/* =========================
            FINANCIAL AGENT
        ========================= */}

        <section className="panel agent-panel">

          <span className="badge">
            🤖 FINANCIAL AGENT
          </span>

          <h2>Ask FinGlass</h2>

          <p>
            Ask questions about your income, expenses,
            savings, subscriptions, or financial goals.
          </p>

          <div className="input-row">

            <input
              type="text"
              value={agentQuestion}
              onChange={(e) =>
                setAgentQuestion(e.target.value)
              }
              placeholder="e.g. How can I save more?"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  askFinancialAgent();
                }
              }}
            />

            <button
              onClick={() => askFinancialAgent()}
            >
              Ask Agent
            </button>

          </div>

          <div className="quick-questions">

            <button
              onClick={() => {
                setAgentQuestion("How can I save more?");
                askFinancialAgent("How can I save more?");
              }}
            >
              💰 How can I save more?
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
              📱 Subscription cost?
            </button>

          </div>

          {agentResponse && (

            <div className="agent-response">

              <h3>🤖 FinGlass Agent</h3>

              <p>{agentResponse}</p>

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

    {agentReasoning.map((step, index) => (
      <p key={index}>
        <strong>{index + 1}.</strong>{" "}
        {step}
      </p>
    ))}

    <p className="agent-final">
      ✓ Reasoning returned by the MeTTa Financial Agent.
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