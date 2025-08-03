# 📊 Financial Data Analyzer - Full Stack Application

A comprehensive full-stack financial data analysis platform built with **FastAPI** (Python) backend and **React.js** frontend. This application provides powerful tools for financial data upload, analysis, visualization, and AI-powered insights.

## 🏗️ Architecture Overview

### **Backend (Python/FastAPI)**
- **Framework**: FastAPI with async/await support
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Cache**: Redis for session management
- **AI Integration**: OpenAI API for intelligent financial analysis
- **File Processing**: Support for CSV and Excel file uploads
- **Background Tasks**: Celery for async data processing

### **Frontend (React.js)**
- **Framework**: React 18 with modern hooks
- **UI Library**: Material-UI (MUI) components
- **Charts**: Recharts for interactive data visualizations
- **State Management**: React Query for API state management
- **HTTP Client**: Axios for API communication
- **File Upload**: React Dropzone for drag-and-drop uploads

## 🚀 Features

### **📈 Dashboard**
- Real-time financial metrics and KPIs
- Interactive charts and graphs
- Revenue, expense, and profit analysis
- Monthly trend visualizations
- Dynamic data updates based on uploaded files

### **📤 Data Upload**
- Drag-and-drop file upload interface
- Support for CSV and Excel formats
- File validation and error handling
- Upload progress tracking
- Automatic data processing and integration

### **💰 Revenue Analysis**
- Detailed revenue breakdowns by category
- Channel-wise revenue distribution
- Top-performing products analysis
- Monthly revenue trends
- Growth rate calculations

### **🤖 AI-Powered Analysis**
- Natural language query interface
- OpenAI-powered financial insights
- Automated report generation
- Trend prediction and recommendations
- Custom analysis queries

## 🛠️ Technology Stack

### **Backend Dependencies**
```
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
asyncpg==0.29.0
pydantic==2.5.0
python-multipart==0.0.6
openai==1.3.0
redis==5.0.1
celery==5.3.4
pandas==2.1.3
numpy==1.25.2
python-dotenv==1.0.0
```

### **Frontend Dependencies**
```
react==18.2.0
react-dom==18.2.0
@mui/material==5.14.0
@mui/icons-material==5.14.0
recharts==2.8.0
react-query==3.39.0
axios==1.6.0
react-dropzone==14.2.0
numeral==2.0.6
```

## 📋 Prerequisites

### **System Requirements**
- **Operating System**: Windows 10/11
- **Python**: 3.8 or higher
- **Node.js**: 16.0 or higher
- **npm**: 8.0 or higher
- **Git**: Latest version

### **Optional (for full deployment)**
- **Docker**: Latest version
- **PostgreSQL**: 13 or higher
- **Redis**: 6.0 or higher

## 🚀 Installation & Setup Guide

### **Step 1: Clone the Repository**
```powershell
# Open PowerShell as Administrator
git clone <repository-url>
cd financial-analyzer-fullstack
```

### **Step 2: Backend Setup**

#### **2.1 Navigate to Backend Directory**
```powershell
cd backend
```

#### **2.2 Create Virtual Environment (Recommended)**
```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# If execution policy error occurs, run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### **2.3 Install Python Dependencies**
```powershell
# Install required packages
pip install fastapi uvicorn python-multipart sqlalchemy asyncpg pydantic openai redis celery pandas numpy python-dotenv httpx psycopg2-binary

# Or install from requirements.txt (if available)
pip install -r requirements.txt
```

#### **2.4 Environment Configuration**
```powershell
# Copy environment template
copy .env.example .env

# Edit .env file with your configurations
notepad .env
```

**Sample .env Configuration:**
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/financial_analyzer
DB_HOST=localhost
DB_PORT=5432
DB_NAME=financial_analyzer
DB_USER=your_username
DB_PASSWORD=your_password

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# Application Settings
SECRET_KEY=your_secret_key_here
ENVIRONMENT=development
DEBUG=true

# CORS Settings
CORS_ORIGINS=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"]
```

### **Step 3: Frontend Setup**

#### **3.1 Navigate to Frontend Directory**
```powershell
# Open a NEW PowerShell window (keep backend terminal open)
cd "c:\Users\Arvind Kumar\CascadeProjects\financial-analyzer-fullstack\frontend"
```

#### **3.2 Install Node.js Dependencies**
```powershell
# Install all frontend dependencies
npm install

# If you encounter any issues, try:
npm install --legacy-peer-deps
```

#### **3.3 Verify Package Installation**
```powershell
# Check if all required packages are installed
npm list react react-dom @mui/material @mui/icons-material recharts react-query axios react-dropzone numeral
```

## 🏃‍♂️ Running the Application

### **Method 1: Development Mode (Recommended)**

#### **Step 1: Start Backend Server**
```powershell
# In backend directory
cd "c:\Users\Arvind Kumar\CascadeProjects\financial-analyzer-fullstack\backend"

# Activate virtual environment (if using)
.\venv\Scripts\Activate.ps1

# Start the FastAPI server
python simple_main.py
```

**Expected Output:**
```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12346] using StatReload
```

#### **Step 2: Start Frontend Server**
```powershell
# In a NEW PowerShell window, navigate to frontend directory
cd "c:\Users\Arvind Kumar\CascadeProjects\financial-analyzer-fullstack\frontend"

# Start React development server
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view financial-analyzer-frontend in the browser.

  Local:            http://localhost:3001
  On Your Network:  http://192.168.1.100:3001

Note that the development build is not optimized.
To create a production build, use npm run build.
```

#### **Step 3: Access the Application**
- **Frontend UI**: http://localhost:3001
- **Backend API**: http://127.0.0.1:8000
- **API Documentation**: http://127.0.0.1:8000/docs

### **Method 2: Docker Deployment (Optional)**

#### **Prerequisites**
- Docker Desktop installed and running
- Docker Compose available

#### **Steps**
```powershell
# In project root directory
docker-compose up --build

# For background execution
docker-compose up -d --build
```

## 📱 Application Usage Guide

### **1. Dashboard Overview**
- **Access**: Navigate to http://localhost:3001
- **Features**: 
  - Financial summary cards (Revenue, Expenses, Profit)
  - Interactive charts and graphs
  - Monthly trend analysis
  - Real-time data updates

### **2. Data Upload**
- **Access**: Click "Data Upload" in the sidebar
- **Supported Formats**: CSV, Excel (.xlsx, .xls)
- **Process**:
  1. Drag and drop files or click to browse
  2. Wait for upload confirmation
  3. Navigate to Dashboard to see updated data

### **3. Revenue Analysis**
- **Access**: Click "Revenue Analysis" in the sidebar
- **Features**:
  - Revenue by category breakdown
  - Channel-wise revenue distribution
  - Top products analysis
  - Monthly revenue trends

### **4. AI Analysis**
- **Access**: Click "AI Analysis" in the sidebar
- **Features**:
  - Natural language queries
  - Automated insights generation
  - Custom analysis requests
  - Export analysis reports

## 🔧 Troubleshooting

### **Common Backend Issues**

#### **Port Already in Use**
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

#### **Python Module Not Found**
```powershell
# Ensure virtual environment is activated
.\venv\Scripts\Activate.ps1

# Reinstall dependencies
pip install -r requirements.txt
```

#### **Database Connection Error**
- Verify PostgreSQL is running
- Check database credentials in `.env` file
- Ensure database exists

### **Common Frontend Issues**

#### **Node Modules Issues**
```powershell
# Delete node_modules and reinstall
rmdir /s node_modules
rmdir /s package-lock.json
npm install
```

#### **Port 3000 Already in Use**
- The app is configured to run on port 3001
- If prompted, choose 'Y' to run on available port

#### **CORS Errors**
- Ensure backend is running on http://127.0.0.1:8000
- Check CORS_ORIGINS in backend `.env` file

### **Performance Optimization**

#### **Backend Optimization**
- Use production ASGI server (Gunicorn + Uvicorn)
- Enable database connection pooling
- Implement Redis caching
- Use background tasks for heavy operations

#### **Frontend Optimization**
```powershell
# Create production build
npm run build

# Serve production build
npm install -g serve
serve -s build -l 3001
```

## 🔒 Security Considerations

### **Production Deployment**
1. **Environment Variables**:
   - Use strong SECRET_KEY
   - Secure database credentials
   - Restrict CORS origins

2. **Database Security**:
   - Use connection pooling
   - Enable SSL connections
   - Regular backups

3. **API Security**:
   - Implement authentication
   - Rate limiting
   - Input validation

## 📊 API Endpoints

### **Financial Data**
- `GET /api/v1/financial-data/analytics/summary` - Get financial summary
- `GET /api/v1/financial-data/records` - Get financial records
- `POST /api/v1/data-upload/upload` - Upload financial data files

### **AI Analysis**
- `POST /api/v1/ai-analysis/analyze` - Generate AI insights
- `GET /api/v1/ai-analysis/history` - Get analysis history

### **Health Check**
- `GET /health` - Application health status
- `GET /docs` - Interactive API documentation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request


## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review API documentation at http://127.0.0.1:8000/docs

---

## 🎯 Quick Start Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Repository cloned
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Environment variables configured
- [ ] Backend server running (http://127.0.0.1:8000)
- [ ] Frontend server running (http://localhost:3001)
- [ ] Application accessible in browser

**🎉 Congratulations! Your Financial Data Analyzer is now running successfully!**
