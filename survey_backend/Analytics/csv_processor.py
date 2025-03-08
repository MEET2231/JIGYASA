import pandas as pd

def process_csv(file_path):
    """Reads a CSV file and extracts column names and data types."""
    df = pd.read_csv(file_path)
    attributes = {col: str(df[col].dtype) for col in df.columns}
    return attributes
