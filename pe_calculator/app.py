import streamlit as st
import yfinance as yf
import pandas as pd

st.set_page_config(page_title="P/E Ratio Calculator")

def get_stock_data(ticker):
    """Fetches stock data from yfinance."""
    try:
        stock = yf.Ticker(ticker)
        # Try fetching history first to see if the ticker is valid
        hist = stock.history(period="30d")
        if hist.empty:
            st.error(f"Could not fetch historical data for '{ticker}'. It might be an invalid ticker.")
            return None, None

        price = hist['Close'].mean()
        eps = stock.info.get('trailingEps')

        if eps is None:
             st.warning(f"Could not retrieve EPS for '{ticker}'. The P/E ratio cannot be calculated.")

        return price, eps
    except Exception as e:
        st.error(f"An error occurred while fetching data for {ticker}: {e}")
        return None, None

def calculate_pe_ratio(price, eps):
    """Calculates the P/E ratio."""
    if price is None or eps is None or eps <= 0:
        return "N/A"
    return round(price / eps, 2)

st.title('P/E Ratio Calculator')

st.write("""
Enter up to 10 stock tickers (comma-separated) to calculate their Price-to-Earnings (P/E) ratios.
The table will show the stock ticker, the calculated average share price, the diluted EPS, and the resulting P/E ratio.
""")

col1, col2 = st.columns(2)

with col1:
    tickers_input = st.text_input('Stock Tickers', 'PIPR, AAPL, GOOGL, MSFT')
with col2:
    st.text_input('Year Quarter', 'TTM (Trailing Twelve Months)', disabled=True)


if st.button('Calculate P/E Ratios'):
    # Sanitize and split tickers
    tickers = [ticker.strip().upper() for ticker in tickers_input.split(',') if ticker.strip()]

    if not tickers:
        st.warning("Please enter at least one stock ticker.")
    elif len(tickers) > 10:
        st.warning("You have entered more than 10 tickers. Only the first 10 will be processed.")
        tickers = tickers[:10]

    if tickers:
        data = []
        for ticker in tickers:
            price, eps = get_stock_data(ticker)
            pe_ratio = calculate_pe_ratio(price, eps)
            data.append({
                "Stock Ticker": ticker,
                "Price per Share": f"${price:.2f}" if price is not None else "N/A",
                "Diluted EPS": f"${eps:.2f}" if eps is not None else "N/A",
                "P/E Ratio": pe_ratio
            })

        if data:
            df = pd.DataFrame(data)
            st.table(df)

            st.markdown("---")
            st.subheader("Methodology and Evidence")
            st.markdown("""
            The Price-to-Earnings (P/E) ratio is a widely used metric to value a company by measuring its current share price relative to its per-share earnings.

            **Calculation:**
            ```
            P/E Ratio = (Price per Share) / (Earnings per Share, or EPS)
            ```

            **Evidence and Data Sources:**
            - **Data Provider:** All financial data is sourced programmatically from **Yahoo Finance** using the `yfinance` Python library. This is a reliable and commonly used source for financial market data.
            - **Price per Share:** The price used in the calculation is the **average of the closing prices over the last 30 days**. This method is chosen to smooth out daily market volatility and provide a more stable representation of the stock's recent valuation. The request to use prices from November 2024 cannot be fulfilled as that period is in the future.
            - **Diluted EPS (Earnings Per Share):** The application uses the **"Trailing EPS"** (`trailingEps`) provided by Yahoo Finance. This figure represents the company's total earnings over the trailing twelve months (TTM), which is the most recent and standardized measure of a company's profitability.
            - **Year Quarter Input:** The "Year Quarter" input is disabled because the `yfinance` API primarily provides trailing twelve-month (TTM) data for EPS, not specific historical quarters. Using TTM data is a standard practice for P/E calculations as it reflects the most recent full year of performance.

            **Example for PIPR:**
            For the ticker **PIPR**, the application follows the exact same process:
            1. It fetches the average stock price for the last 30 days.
            2. It retrieves the trailing diluted EPS.
            3. It divides the average price by the EPS to calculate the P/E ratio, which is then rounded to two decimal places.

            This standardized approach ensures a consistent and transparent calculation for all entered tickers.
            """)
