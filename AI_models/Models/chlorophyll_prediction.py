import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib

class AlgalBloomPredictor:
    def __init__(self):
        self.model = None
        self.feature_names = ['chlorophyll_a_ug_l', 'do_mg_l', 'water_temp_c', 'turbidity_ntu']
        self.target_name = 'bloom_risk_score'
        
    def train_model(self, csv_file_path):
        """Train the algal bloom prediction model"""
        # Load data
        data = pd.read_csv(csv_file_path)
        print(f"Data loaded: {data.shape}")
        
        # Prepare features and target
        X = data[self.feature_names]
        y = data[self.target_name]
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train Random Forest model
        self.model = RandomForestRegressor(
            n_estimators=200,
            max_depth=20,
            min_samples_split=2,
            min_samples_leaf=1,
            random_state=42
        )
        
        self.model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = self.model.predict(X_test)
        r2 = r2_score(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        
        print(f"Model trained successfully!")
        print(f"R² Score: {r2:.4f}")
        print(f"RMSE: {rmse:.4f}")
        
        return self.model
    
    def predict(self, chlorophyll_a, do, water_temp, turbidity):
        """Make prediction for given parameters"""
        if self.model is None:
            raise ValueError("Model not trained. Please train the model first.")
        
        # Create input array
        input_data = np.array([[chlorophyll_a, do, water_temp, turbidity]])
        
        # Make prediction
        prediction = self.model.predict(input_data)[0]
        
        # Ensure prediction is within valid range [0, 1]
        prediction = np.clip(prediction, 0, 1)
        
        return prediction
    
    def save_model(self, filepath=r'C:\Users\conne\OneDrive\Desktop\Hackout\Coastal_Threat_Alert_System\AI_models\Models/algal_bloom_model.pkl'):
        """Save the trained model"""
        if self.model is None:
            raise ValueError("No model to save. Please train the model first.")
        
        model_data = {
            'model': self.model,
            'feature_names': self.feature_names,
            'target_name': self.target_name
        }
        
        joblib.dump(model_data, filepath)
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath):
        """Load a saved model"""
        model_data = joblib.load(filepath)
        self.model = model_data['model']
        self.feature_names = model_data['feature_names']
        self.target_name = model_data['target_name']
        print(f"Model loaded from {filepath}")

# Example usage
if __name__ == "__main__":
    # Example of loading saved model
    new_predictor = AlgalBloomPredictor()
    new_predictor.load_model(r'C:\Users\conne\OneDrive\Desktop\Hackout\Coastal_Threat_Alert_System\AI_models\Models\algal_bloom_model.pkl')
    
    # Make prediction with loaded model
    risk_score = new_predictor.predict(20.0, 4.0, 28.0, 22.0)
    print(f"Prediction with loaded model: {risk_score:.3f}")