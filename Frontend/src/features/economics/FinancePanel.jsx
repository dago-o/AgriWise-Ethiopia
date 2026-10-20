import { useState } from "react";
import { Coins, Pencil, Plus, Trash2 } from "lucide-react";
import { Alert } from "../../components/feedback/Alert.jsx";
import { LoadingScreen } from "../../components/feedback/LoadingScreen.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog.jsx";
import { IconButton } from "../../components/ui/IconButton.jsx";
import { SimpleBarChart } from "../../components/ui/SimpleBarChart.jsx";
import { StatRow } from "../../components/ui/StatRow.jsx";
import { useToast } from "../../context/useToast.js";
import { useAsync } from "../../hooks/useAsync.js";
import { deleteExpense, deleteIncome, fetchEconomicSummary, fetchExpenses, fetchIncome } from "../../lib/endpoints.js";
import { formatCurrency, formatDate, formatLabel, formatNumber } from "../../lib/formatters.js";
import { ExpenseFormModal } from "./ExpenseFormModal.jsx";
import { IncomeFormModal } from "./IncomeFormModal.jsx";

function RowActions({ what, onEdit, onDelete }) {
  return (
    <div className="flex shrink-0 gap-1">
      <IconButton label={`Edit ${what}`} onClick={onEdit}><Pencil className="h-4 w-4" /></IconButton>
      <IconButton label={`Delete ${what}`} tone="danger" onClick={onDelete}><Trash2 className="h-4 w-4" /></IconButton>
    </div>
  );
}

export function FinancePanel({ cropId }) {
  const toast = useToast();
  const summary = useAsync((signal) => fetchEconomicSummary(cropId, { signal }), [cropId]);
  const expenses = useAsync((signal) => fetchExpenses(cropId, { signal }), [cropId]);
  const income = useAsync((signal) => fetchIncome(cropId, { signal }), [cropId]);

  const [expenseEdit, setExpenseEdit] = useState(null);
  const [incomeEdit, setIncomeEdit] = useState(null);
  const [expenseDelete, setExpenseDelete] = useState(null);
  const [incomeDelete, setIncomeDelete] = useState(null);

  const reloadAll = () => { summary.reload(); expenses.reload(); income.reload(); };
  const failure = summary.error || expenses.error || income.error;
  const s = summary.data;

  if (failure) return <Alert title="We could not load the finances" onRetry={reloadAll}>{failure.message}</Alert>;
  if (!s || !expenses.data || !income.data) return <LoadingScreen label="Loading finances…" />;

  const empty = expenses.data.length === 0 && income.data.length === 0;
  const byCategory = Object.entries(
    expenses.data.reduce((acc, e) => ({ ...acc, [e.category]: (acc[e.category] ?? 0) + e.amount }), {}),
  )
    .map(([category, total]) => ({ label: formatLabel(category), value: total }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      <StatRow
        stats={[
          { label: "Income", value: formatCurrency(s.totalIncome) },
          { label: "Expenses", value: formatCurrency(s.totalExpenses) },
          { label: s.profit < 0 ? "Loss so far" : "Profit so far", value: formatCurrency(s.profit), tone: s.profit < 0 ? "bad" : s.profit > 0 ? "good" : undefined },
        ]}
      />

      {empty ? (
        <div className="rounded-xl border border-forest-200 bg-forest-50 p-5 text-sm text-forest-800">
          <p className="flex items-center gap-2 font-semibold"><Coins className="h-[18px] w-[18px]" />No money recorded for this crop yet</p>
          <p className="mt-1">Add what you spend on seed, labour and inputs, and what you earn when you sell. Profit is calculated for you.</p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-ivory-200 px-5 py-4">
            <h2 className="text-base font-semibold text-forest-900">Expenses</h2>
            <Button size="sm" onClick={() => setExpenseEdit("new")}><Plus className="h-4 w-4" />Add expense</Button>
          </div>
          {expenses.data.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-ink-soft">No expenses recorded.</p>
          ) : (
            <ul className="divide-y divide-ivory-200">
              {expenses.data.map((e) => (
                <li key={e._id} className="flex items-start justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{formatCurrency(e.amount)} <span className="font-normal text-ink-muted">· {formatLabel(e.category)}</span></p>
                    <p className="text-sm text-ink-soft">{formatDate(e.expenseDate)}{e.description ? ` · ${e.description}` : ""}</p>
                  </div>
                  <RowActions what="expense" onEdit={() => setExpenseEdit(e)} onDelete={() => setExpenseDelete(e)} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-ivory-200 px-5 py-4">
            <h2 className="text-base font-semibold text-forest-900">Income</h2>
            <Button size="sm" onClick={() => setIncomeEdit("new")}><Plus className="h-4 w-4" />Add income</Button>
          </div>
          {income.data.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-ink-soft">No income recorded.</p>
          ) : (
            <ul className="divide-y divide-ivory-200">
              {income.data.map((i) => (
                <li key={i._id} className="flex items-start justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">
                      {formatCurrency(i.amount)}
                      {i.quantity != null ? <span className="font-normal text-ink-muted"> · {formatNumber(i.quantity)} {i.unit}</span> : null}
                    </p>
                    <p className="text-sm text-ink-soft">{formatDate(i.incomeDate)}{i.description ? ` · ${i.description}` : ""}</p>
                  </div>
                  <RowActions what="income" onEdit={() => setIncomeEdit(i)} onDelete={() => setIncomeDelete(i)} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {byCategory.length > 0 ? (
        <Card>
          <h2 className="text-base font-semibold text-forest-900">Where the money went</h2>
          <p className="mb-4 text-sm text-ink-muted">Total expenses recorded for this crop, by category.</p>
          <SimpleBarChart items={byCategory} format={formatCurrency} color="bg-harvest-500" />
        </Card>
      ) : null}

      <ExpenseFormModal open={expenseEdit !== null} onClose={() => setExpenseEdit(null)} cropId={cropId} record={expenseEdit && expenseEdit !== "new" ? expenseEdit : null} onSaved={() => { toast.success(expenseEdit === "new" ? "Expense added." : "Expense updated."); reloadAll(); }} />
      <IncomeFormModal open={incomeEdit !== null} onClose={() => setIncomeEdit(null)} cropId={cropId} record={incomeEdit && incomeEdit !== "new" ? incomeEdit : null} onSaved={() => { toast.success(incomeEdit === "new" ? "Income added." : "Income updated."); reloadAll(); }} />
      <ConfirmDialog open={Boolean(expenseDelete)} onClose={() => setExpenseDelete(null)} title="Delete this expense?" message="This expense will be permanently removed and profit recalculated." onConfirm={async () => { await deleteExpense(expenseDelete._id); toast.success("Expense deleted."); reloadAll(); }} />
      <ConfirmDialog open={Boolean(incomeDelete)} onClose={() => setIncomeDelete(null)} title="Delete this income entry?" message="This income entry will be permanently removed and profit recalculated." onConfirm={async () => { await deleteIncome(incomeDelete._id); toast.success("Income deleted."); reloadAll(); }} />
    </div>
  );
}
