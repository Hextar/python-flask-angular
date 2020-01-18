from app import create_app
from engine.machine_learning import MachineLearning


app = create_app()
ml = MachineLearning(1)

