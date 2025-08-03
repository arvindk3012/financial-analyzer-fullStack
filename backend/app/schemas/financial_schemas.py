from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class FinancialRecordBase(BaseModel):
    date: datetime
    category: str
    amount: float
    description: Optional[str] = None
    record_type: str

class FinancialRecordCreate(FinancialRecordBase):
    dataset_id: int

class FinancialRecordResponse(FinancialRecordBase):
    id: int
    dataset_id: int
    
    class Config:
        from_attributes = True

class FinancialDatasetBase(BaseModel):
    name: str
    description: Optional[str] = None

class FinancialDatasetCreate(FinancialDatasetBase):
    owner_id: int

class FinancialDatasetResponse(FinancialDatasetBase):
    id: int
    file_path: Optional[str] = None
    upload_date: datetime
    owner_id: int
    
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
