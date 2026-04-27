import io
import pandas as pd

def forecast(csv_text: str) -> str:
    df = pd.read_csv(io.StringIO(csv_text))

    if "Amount" not in df.columns:
        return "Error: CSV must have an 'Amount' column."

    df["Amount"] = pd.to_numeric(df["Amount"], errors="coerce").fillna(0)

    income   = df[df["Amount"] > 0]["Amount"].sum()
    expenses = df[df["Amount"] < 0]["Amount"].sum()
    net      = income + expenses

    top_expenses = (
        df[df["Amount"] < 0]
        .nsmallest(5, "Amount")[["Description", "Amount"]]
        .to_string(index=False)
        if "Description" in df.columns else "N/A"
    )

    return (
        f"Income:               ${income:,.2f}\n"
        f"Expenses:             ${abs(expenses):,.2f}\n"
        f"Net:                  ${net:,.2f}\n"
        f"Projected next month: ${net:,.2f}\n\n"
        f"Top 5 expenses:\n{top_expenses}"
    )
