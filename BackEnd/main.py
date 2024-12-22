from fastapi import FastAPI,File,UploadFile,Form
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
from fastapi.middleware.cors import CORSMiddleware

import os

app1 = FastAPI()




origins = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://127.0.0.1:5500",
    "http://localhost:5500"

]

app1.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specific origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Allows all headers
)



MODEL_POTATO = tf.keras.models.load_model("PotatoModel.keras")# type:ignore
CLASSES_POTATO = ["Early Blight","Late Blight","Healthy"]


MODEL_PEPPER = tf.keras.models.load_model("Pepper_model.keras")# type:ignore
CLASSES_PEPPER = ["Bacterial Spot","Healthy"]



@app1.get("/")
async def hello():
    return {"hello":"Hello Shreyansh"}



def read_image(data)-> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image


@app1.post("/prediction")
async def predict(file:UploadFile=File(...),plant_type:str = Form(...)):
    try:
        bytes = await file.read()
        img = read_image(bytes)
        img_batch = np.expand_dims(img,0)
        result_list = []
        
        if plant_type == "potato" :
            predictions = MODEL_POTATO.predict(img_batch)
            confidence = np.argmax(predictions)
            result = CLASSES_POTATO[confidence]
            result_list = ["Potato Plant",str(result),str(predictions[0][confidence])]
        else:
            predictions = MODEL_PEPPER.predict(img_batch)
            confidence = np.argmax(predictions)
            result = CLASSES_PEPPER[confidence]
            result_list = ["Pepper Plant",str(result),str(predictions[0][confidence])]

        # print(result_list)
        return {"Type":result_list[0],
                "Result":result_list[1],
                "Accuracy":result_list[2]}
    except:
        return {"Type":"Error",
                "Result":"No Result",
                "Accuracy":"0"}

