import os
from fastapi import UploadFile


def save_temp_file(file: UploadFile) -> str:
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(file.file.read())
    print(f"File saved to {temp_path}")
    return temp_path


def delete_file(file_path: str):
    if os.path.exists(file_path):
        os.remove(file_path)
        print(f"Deleted file: {file_path}")
