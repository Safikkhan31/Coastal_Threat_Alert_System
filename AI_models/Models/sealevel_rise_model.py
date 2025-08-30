import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import joblib
from datetime import datetime, timedelta
def train_model():
    """Train Random Forest model to predict sea level rise"""
    df = pd.read_csv(r'../datafetch/tide_data.csv')
    
    # Features and target
    X = df[['water_level_cm', 'rainfall_mm_hr']]
    y = df['sea_level_rise']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=8)
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"Model Performance:")
    print(f"MSE: {mse:.2f}")
    print(f"R²: {r2:.3f}")
    
    return model

# Prediction function
def predict_sea_level_rise(model, water_level_cm, rainfall_mm_hr):
    """
    Predict sea level rise based on water level and rainfall
    
    Args:
        model: Trained model
        water_level_cm: Water level in centimeters
        rainfall_mm_hr: Rainfall in mm/hr
    
    Returns:
        Predicted sea level rise in cm
    """
    features = np.array([[water_level_cm, rainfall_mm_hr]])
    prediction = model.predict(features)[0]
    return round(prediction, 1)

# Save model function
def save_model(model, filename=r'./sea_level_rise_model.pkl'):
    """
    Save the trained model to disk
    
    Args:
        model: Trained model object
        filename: Name of the file to save the model
    """
    joblib.dump(model, filename)
    print(f"Model saved as {filename}")

# Load model function
def load_model(filename):
    """
    Load a saved model from disk
    
    Args:
        filename: Name of the saved model file
    
    Returns:
        Loaded model object
    """
    model = joblib.load(filename)
    print(f"Model loaded from {filename}")
    return model

# Example usage
if __name__ == "__main__":
    
    
    loaded_model = load_model(r'./sea_level_rise_model.pkl')
    test_prediction = predict_sea_level_rise(loaded_model, 65.2, 18.5)
    print(f"Test with loaded model: Water Level: 65.2cm, Rainfall: 18.5mm/hr -> {test_prediction}cm")