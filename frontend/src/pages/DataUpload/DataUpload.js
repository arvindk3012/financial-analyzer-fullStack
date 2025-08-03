import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  CloudUpload,
  CheckCircle,
  Error,
  InsertDriveFile,
  Assessment,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const DataUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation(
    async (formData) => {
      const response = await axios.post('/api/v1/data-upload/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        setUploadedFiles(prev => [...prev, data]);
        queryClient.invalidateQueries('dashboardData');
        setUploadProgress(0);
      },
      onError: (error) => {
        console.error('Upload failed:', error);
        setUploadProgress(0);
      },
    }
  );

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('dataset_name', file.name.split('.')[0]);
      formData.append('description', `Uploaded file: ${file.name}`);
      
      uploadMutation.mutate(formData);
    });
  }, [uploadMutation]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
    rejectedFiles,
  } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Data Upload
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Upload your financial data files for analysis
      </Typography>

      <Grid container spacing={3}>
        {/* Upload Area */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box
                {...getRootProps()}
                sx={{
                  border: '2px dashed',
                  borderColor: isDragActive ? 'primary.main' : 'grey.300',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <input {...getInputProps()} />
                <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {isDragActive
                    ? 'Drop the files here...'
                    : 'Drag & drop files here, or click to select'}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Supported formats: CSV, Excel (.xlsx, .xls)
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Maximum file size: 10MB
                </Typography>
              </Box>

              {uploadMutation.isLoading && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Uploading... {uploadProgress}%
                  </Typography>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                </Box>
              )}

              {uploadMutation.isError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Upload failed. Please try again.
                </Alert>
              )}

              {uploadMutation.isSuccess && uploadedFiles.length > 0 && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    ✅ File uploaded successfully!
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {uploadedFiles[uploadedFiles.length - 1]?.total_records || 0} records processed from {uploadedFiles[uploadedFiles.length - 1]?.filename}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button 
                      size="small" 
                      variant="contained" 
                      onClick={() => window.location.href = '/dashboard'}
                    >
                      View Dashboard
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => window.location.href = '/revenue-analysis'}
                    >
                      Analyze Revenue
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => window.location.href = '/ai-analysis'}
                    >
                      AI Analysis
                    </Button>
                  </Box>
                </Alert>
              )}

              {rejectedFiles && rejectedFiles.length > 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Some files were rejected. Please check file format and size.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upload Guidelines */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Upload Guidelines
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Required Columns"
                    secondary="Date, Amount, Type (Revenue/Expense)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Optional Columns"
                    secondary="Category, Description, Reference"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Date Format"
                    secondary="YYYY-MM-DD or MM/DD/YYYY"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Amount Format"
                    secondary="Numeric values (no currency symbols)"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Sample Data Template */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Sample Template
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<InsertDriveFile />}
                onClick={() => {
                  // Download sample CSV template
                  const csvContent = `Date,Amount,Type,Category,Description
2024-01-01,5000,Revenue,Sales,Product sales
2024-01-02,1200,Expense,Marketing,Online advertising
2024-01-03,3500,Revenue,Services,Consulting services
2024-01-04,800,Expense,Operations,Office supplies`;
                  
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'financial_data_template.csv';
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
              >
                Download Template
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Recently Uploaded Files
                </Typography>
                <List>
                  {uploadedFiles.map((file, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          <Assessment color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={file.dataset_name}
                          secondary={`${file.total_records} records • ${file.file_size} bytes • Uploaded ${new Date(file.upload_date).toLocaleString()}`}
                        />
                        <Box>
                          <Chip
                            label="Success"
                            color="success"
                            size="small"
                            icon={<CheckCircle />}
                          />
                        </Box>
                      </ListItem>
                      {index < uploadedFiles.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DataUpload;
