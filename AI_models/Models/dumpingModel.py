import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import joblib

# ==============================
# Train Model
# ==============================
def train_model():
    """Train Random Forest model to predict illegal dumping quantity"""
    df = pd.read_csv(r'C:\Users\conne\OneDrive\Desktop\Hackout\Coastal_Threat_Alert_System\AI_models\datafetch\illegal_dumping_dataset.csv')
    
    # Features and target
    X = df[['tss_mg_l', 'turbidity_ntu', 'do_mg_l']]
    y = df['dumping_quantity']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Train Random Forest
    model = RandomForestRegressor(
        n_estimators=100, random_state=42, max_depth=8
    )
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print("Model Performance:")
    print(f"MSE: {mse:.2f}")
    print(f"R²: {r2:.3f}")
    
    return model

# ==============================
# Prediction Function
# ==============================
def predict_dumping_quantity(model, tss_mg_l, turbidity_ntu, do_mg_l):
    """
    Predict illegal dumping quantity
    
    Args:
        model: Trained Random Forest model
        tss_mg_l: Total Suspended Solids (mg/L)
        turbidity_ntu: Turbidity (NTU)
        do_mg_l: Dissolved Oxygen (mg/L)
    
    Returns:
        Predicted dumping quantity in kg
    """
    features = np.array([[tss_mg_l, turbidity_ntu, do_mg_l]])
    prediction = model.predict(features)[0]
    return round(prediction, 2)

# ==============================
# Save / Load Model
# ==============================
def save_model(model, filename=r'C:\Users\conne\OneDrive\Desktop\Hackout\Coastal_Threat_Alert_System\AI_models\Models/dumping_model.pkl'):
    joblib.dump(model, filename)
    print(f"Model saved as {filename}")

def load_model(filename):
    model = joblib.load(filename)
    print(f"Model loaded from {filename}")
    return model

# ==============================
# Example Usage
# ==============================
if __name__ == "__main__":
   
    
    # Load model and test prediction
    loaded_model = load_model(r'C:\Users\conne\OneDrive\Desktop\Hackout\Coastal_Threat_Alert_System\AI_models\Models\dumping_model.pkl')
    test_prediction = predict_dumping_quantity(loaded_model, tss_mg_l=250, turbidity_ntu=150, do_mg_l=5.5)
    print(f"Predicted Dumping Quantity: {test_prediction} kg")