from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    datasets = relationship("FinancialDataset", back_populates="owner")

class FinancialDataset(Base):
    __tablename__ = "financial_datasets"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    file_path = Column(String)
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("User", back_populates="datasets")
    records = relationship("FinancialRecord", back_populates="dataset")

class FinancialRecord(Base):
    __tablename__ = "financial_records"
    
    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("financial_datasets.id"))
    date = Column(DateTime)
    category = Column(String)
    amount = Column(Float)
    description = Column(Text)
    record_type = Column(String)  # revenue, expense, etc.
    
    dataset = relationship("FinancialDataset", back_populates="records")

class KPIMetric(Base):
    __tablename__ = "kpi_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    value = Column(Float)
    period = Column(String)
    calculated_at = Column(DateTime(timezone=True), server_default=func.now())

class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    query = Column(Text)
    result = Column(Text)
    analysis_type = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
