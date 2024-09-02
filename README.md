# Data Analysis Project

This project consists of a backend for data analysis and a frontend for visualizing the results. I used Python for the analysis part. 

## Features

- **Summary**: Provides a statistical summary of the dataset (max, mean, min, stddev, count).
- **Column Types**: Displays the data types of each column.
- **Missing Values**: Shows the count of missing values in each column.
- **Correlation Heatmap**: Generates a heatmap to visualize the correlation between columns.
- **Correlation Matrix**: Provides a matrix of correlation coefficients.
- **Feature Importance**: Calculates the importance of each feature in predicting the target variable.
- **Residuals**: Fits linear and polynomial regression models and plots the residuals.
- **Histograms**: Plots histograms with the distribution of each column.

## Running the Backend

To run the backend for data analysis, follow these steps:

Navigate to the `analysis` directory and run the Python script:
    ```sh
    cd analysis
    python3 main.py
    ```

## Running the Frontend

To run the frontend, follow these steps:

2. Run the frontend using `pnpm` (or an npm alternative):
    ```sh
    pnpm dev
    # or
    npm run dev
    ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Dataset Compatibility

I have tested this project with the following dataset, and all the options work with this data.:
- [Wine Quality Dataset](https://archive.ics.uci.edu/dataset/186/wine+quality)

I haven't tested many other datasets, so compatibility with other datasets is not guaranteed.
