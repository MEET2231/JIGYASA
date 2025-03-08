import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

def generate_graph(file_path, x_col, y_col, graph_type="bar"):
    """Generates a graph based on user input and saves it as an image."""
    df = pd.read_csv(file_path)
    
    plt.figure(figsize=(10, 6))

    if graph_type == "bar":
        sns.barplot(x=df[x_col], y=df[y_col])
    elif graph_type == "line":
        sns.lineplot(x=df[x_col], y=df[y_col])
    elif graph_type == "scatter":
        sns.scatterplot(x=df[x_col], y=df[y_col])
    
    plt.xticks(rotation=45)
    plt.title(f"{graph_type.capitalize()} Graph of {x_col} vs {y_col}")
    plt.savefig("generated_graph.png")  
    plt.close()
    
    return "generated_graph.png"
