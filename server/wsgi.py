from app import create_app
from engine.machine_learning import MachineLearning

# Create the app
app = create_app()

# Instruct the machine learning model if needed
ml = MachineLearning(1)

