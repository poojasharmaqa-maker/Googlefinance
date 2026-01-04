# P/E Ratio Calculator

This is a simple web application built with Streamlit that allows users to calculate the Price-to-Earnings (P/E) ratio for up to 10 publicly traded companies.

## Features

-   Input up to 10 stock tickers, separated by commas.
-   Calculates P/E ratios based on the 30-day average stock price and Trailing Twelve Months (TTM) diluted EPS.
-   Displays the results in a clean, easy-to-read table.
-   Provides a detailed explanation of the calculation methodology and data sources (Yahoo Finance).

---

## Running the Application

There are two recommended ways to run this application: using a standard Python environment or using Anaconda and Jupyter Notebook.

### Option 1: Standard Python Environment

**1. Create a Virtual Environment (Recommended)**
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

**2. Install Dependencies**
```bash
pip install -r pe_calculator/requirements.txt
```

**3. Run the Streamlit App**
```bash
streamlit run pe_calculator/app.py
```

### Option 2: Using Anaconda and Jupyter Notebook

**1. Create a Conda Environment**
First, ensure you have Anaconda or Miniconda installed. Then, create a new environment for this project.
```bash
conda create --name pe-calculator python=3.9
```

**2. Activate the Environment**
```bash
conda activate pe-calculator
```

**3. Install Dependencies**
Install the required packages from the `requirements.txt` file.
```bash
pip install -r pe_calculator/requirements.txt
```

**4. Install Jupyter Notebook**
If you don't have it in your base environment, you'll need to install Jupyter.
```bash
conda install -c anaconda jupyter
```

**5. Run the Application from a Jupyter Notebook**
You can launch the Streamlit app directly from a Python script or a Jupyter Notebook. Create a new notebook (`.ipynb`) and add the following code to a cell:

```python
import subprocess

# Path to your Streamlit app script
app_path = "pe_calculator/app.py"

# Command to run the Streamlit app
command = ["streamlit", "run", app_path]

# Start the Streamlit app as a subprocess
process = subprocess.Popen(command)

# You can interact with the app in the browser window that opens.
# To stop the app, interrupt the kernel in Jupyter.
```

Now, run the cell. This will start the Streamlit server, and you can view the application by navigating to the local URL provided in the output (usually `http://localhost:8501`).
