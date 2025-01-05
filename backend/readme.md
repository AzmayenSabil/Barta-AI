
## To activate a virtual environment
```
source venv/bin/activate

```

## To install the required packages
```
pip install -r requirements.txt
```

## To run the backend
```
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## To update requirements.txt
```
pip freeze > requirements.txt

```