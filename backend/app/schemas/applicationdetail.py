from pydantic import BaseModel

class ApplicationDetails(BaseModel):
    name: str 
    email: str
    mobileNumber: str
    complete_address:str
    State:str
    District:str
    pincode: str

