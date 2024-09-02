import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

def clean_data(df):
    # Remove any leading/trailing whitespace from column names
    df.columns = df.columns.str.strip()
    
    # Convert all columns to numeric, if possible
    for col in df.columns:
        df[col] = pd.to_numeric(df[col], errors='ignore')
    
    # Drop rows with any NaN values
    df = df.dropna()
    
    # Remove outliers using IQR method
    Q1 = df.quantile(0.25)
    Q3 = df.quantile(0.75)
    IQR = Q3 - Q1
    df = df[~((df < (Q1 - 1.5 * IQR)) | (df > (Q3 + 1.5 * IQR))).any(axis=1)]
    
    return df

def create_correlation_heatmap(df):
    plt.figure(figsize=(12, 10))
    correlation_matrix = df.corr()
    sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', linewidths=0.5)
    plt.title('Correlation Heatmap')
    
    # Save the plot to a bytes buffer
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight')
    buffer.seek(0)
    
    # Encode the image to base64
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    plt.close()
    
    return image_base64

def calculate_feature_importance(df, target_column):
    X = df.drop(target_column, axis=1)
    y = df[target_column]
    
    # Check if the target column is numeric or categorical
    if pd.api.types.is_numeric_dtype(y):
        model = RandomForestRegressor(n_estimators=100, random_state=42)
    else:
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        le = LabelEncoder()
        y = le.fit_transform(y)
    
    model.fit(X, y)
    feature_importance = pd.Series(model.feature_importances_, index=X.columns).sort_values(ascending=False)
    return feature_importance.to_dict()

def create_histogram(data, title):
    plt.figure(figsize=(10, 6))
    sns.histplot(data, kde=True)
    plt.title(title)
    
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    plt.close()
    
    return image_base64

def create_residual_plot(y_true, y_pred, title):
    residuals = y_true - y_pred
    plt.figure(figsize=(10, 6))
    sns.histplot(residuals, kde=True)
    plt.title(title)
    
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    plt.close()
    
    return image_base64

def analyze_data(df, options):
    print("Original DataFrame:")
    print(df.head())
    print(df.dtypes)
    
    df_cleaned = clean_data(df)
    
    print("Cleaned DataFrame:")
    print(df_cleaned.head())
    print(df_cleaned.dtypes)
    
    result = {}
    
    if options.get('summary', False):
        result['summary'] = df_cleaned.describe(include='all').to_dict()
    
    if options.get('columnTypes', False):
        result['column_types'] = df_cleaned.dtypes.apply(lambda x: x.name).to_dict()
    
    if options.get('missingValues', False):
        result['missing_values'] = df_cleaned.isnull().sum().to_dict()
    
    if options.get('correlationHeatmap', False):
        result['correlation_heatmap'] = create_correlation_heatmap(df_cleaned)
    
    if options.get('correlationMatrix', False):
        result['correlation_matrix'] = df_cleaned.corr().to_dict()
    
    if options.get('skewnessKurtosis', False):
        result['skewness'] = df_cleaned.skew().to_dict()
        result['kurtosis'] = df_cleaned.kurtosis().to_dict()
    
    if options.get('featureImportance', False):
        target_column = options.get('targetColumn')
        if target_column and target_column in df_cleaned.columns:
            result['feature_importance'] = calculate_feature_importance(df_cleaned, target_column)
    
    if options.get('histograms', False):
        result['histograms'] = {col: create_histogram(df_cleaned[col], f'Histogram of {col}') for col in df_cleaned.columns}
    
    if options.get('residuals', False):
        target_column = options.get('targetColumn')
        if target_column and target_column in df_cleaned.columns:
            X = df_cleaned.drop(target_column, axis=1)
            y = df_cleaned[target_column]
            
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            model = LinearRegression()
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
            
            result['residuals'] = create_residual_plot(y_test, y_pred, f'Residuals for {target_column}')
    
    # Add list of column names for frontend dropdown
    result['columns'] = df_cleaned.columns.tolist()
    
    return result