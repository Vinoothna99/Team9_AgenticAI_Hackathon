import io
import pandas as pd
def forecast(csv_text: str) -> str:
    df = pd.read_csv(io.StringIO(csv_text)) #produce a data frame

    #from test data

    income = df[df["Amount"]>0]["Amount"].sum()
    expenses = df[df["Amount"]<0]["Amount"].sum()
    net = income + expenses

    return(
        f"Income:       ${income:,.2f}\n"
        f"Expenses:     ${abs(expenses):,.2f}\n"
        f"Net :         ${net:,.2f}\n"
        f"Projected Next month:${net:,.2f}"
    )
