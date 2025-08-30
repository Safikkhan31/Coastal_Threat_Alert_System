import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import joblib

class CycloneCategoryPredictor:
    def __init__(self):
        self.model = None
        self.feature_names = ['wind_speed_ms', 'pressure_hpa', 'sst_celsius', 'wave_height_m']
        self.target_name = 'saffir_simpson_category'
        
    def train_model(self, csv_file_path):
        """Train the cyclone category prediction model"""
        # Load data
        data = pd.read_csv(csv_file_path)
        print(f"Data loaded: {data.shape}")
        
        # Prepare features and target
        X = data[self.feature_names]
        y = data[self.target_name]
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Train Random Forest Classifier
        self.model = RandomForestClassifier(
            n_estimators=200,
            max_depth=20,
            min_samples_split=2,
            min_samples_leaf=1,
            random_state=42
        )
        
        self.model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"Model trained successfully!")
        print(f"Accuracy: {accuracy:.4f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        return self.model
    
    def predict(self, wind_speed_ms, pressure_hpa, sst_celsius, wave_height_m):
        """Predict cyclone category for given parameters"""
        if self.model is None:
            raise ValueError("Model not trained. Please train the model first.")
        
        # Create input array
        input_data = np.array([[wind_speed_ms, pressure_hpa, sst_celsius, wave_height_m]])
        
        # Make prediction
        prediction = self.model.predict(input_data)[0]
        
        # Get prediction probability
        probabilities = self.model.predict_proba(input_data)[0]
        confidence = np.max(probabilities)
        
        # Category descriptions
        category_descriptions = {
            0: "Tropical Depression/Storm",
            1: "Category 1 Hurricane", 
            2: "Category 2 Hurricane",
            3: "Category 3 Major Hurricane",
            4: "Category 4 Major Hurricane",
            5: "Category 5 Catastrophic Hurricane"
        }
        
        return int(prediction)
    
    def save_model(self, filepath=r'./Modelscyclone_category_model.pkl'):
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
    # Initialize predictor
    
    # Example of loading saved model
    new_predictor = CycloneCategoryPredictor()
    new_predictor.load_model(r'./Modelscyclone_category_model.pkl')
    
    # Make prediction with loaded model
    result = new_predictor.predict(45, 980, 28.5, 6.5)
    print(f"Prediction with loaded model: Category {result['category']} - {result['description']}")