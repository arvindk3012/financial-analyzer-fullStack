import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Psychology,
  Send,
  TrendingUp,
  Assessment,
  CompareArrows,
  Warning,
  Insights,
  ExpandMore,
  Lightbulb,
  Analytics,
  Timeline,
} from '@mui/icons-material';
import { useMutation, useQuery } from 'react-query';
import axios from 'axios';

const predefinedAnalyses = [
  {
    id: 'trend',
    title: 'Trend Analysis',
    description: 'Analyze revenue and expense trends over time',
    icon: <TrendingUp />,
    color: '#667eea',
  },
  {
    id: 'health',
    title: 'Financial Health Assessment',
    description: 'Comprehensive evaluation of financial performance',
    icon: <Assessment />,
    color: '#4ecdc4',
  },
  {
    id: 'comparative',
    title: 'Comparative Analysis',
    description: 'Compare performance across different periods',
    icon: <CompareArrows />,
    color: '#96ceb4',
  },
  {
    id: 'risk',
    title: 'Risk Assessment',
    description: 'Identify potential financial risks and concerns',
    icon: <Warning />,
    color: '#ff6b6b',
  },
  {
    id: 'forecast',
    title: 'Forecast Analysis',
    description: 'Predict future financial performance',
    icon: <Timeline />,
    color: '#764ba2',
  },
];

function AIAnalysis() {
  const [selectedAnalysis, setSelectedAnalysis] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [analysisResults, setAnalysisResults] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState('');

  // Mock datasets query
  const { data: datasets } = useQuery(
    'datasets',
    () => Promise.resolve([
      { id: 1, name: 'Q1 2024 Financial Data', records: 1250 },
      { id: 2, name: 'Annual Report 2023', records: 3400 },
      { id: 3, name: 'Monthly Expenses', records: 890 },
    ])
  );

  const analysisMutation = useMutation(
    async ({ analysisType, prompt, datasetId }) => {
      const response = await axios.post('/api/v1/ai/analyze', {
        dataset_id: datasetId,
        analysis_type: analysisType,
        custom_prompt: prompt,
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        setAnalysisResults(prev => [data, ...prev]);
      },
    }
  );

  const handlePredefinedAnalysis = (analysisType) => {
    if (!selectedDataset) {
      alert('Please select a dataset first');
      return;
    }
    
    analysisMutation.mutate({
      analysisType,
      datasetId: selectedDataset,
    });
  };

  const handleCustomAnalysis = () => {
    if (!selectedDataset || !customPrompt.trim()) {
      alert('Please select a dataset and enter a custom prompt');
      return;
    }
    
    analysisMutation.mutate({
      analysisType: 'custom',
      prompt: customPrompt,
      datasetId: selectedDataset,
    });
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          AI-Powered Analysis
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Get intelligent insights from your financial data using advanced AI analysis
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Analysis Controls */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                <Psychology sx={{ mr: 1, verticalAlign: 'middle' }} />
                Analysis Settings
              </Typography>
              
              {/* Dataset Selection */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Select Dataset</InputLabel>
                <Select
                  value={selectedDataset}
                  label="Select Dataset"
                  onChange={(e) => setSelectedDataset(e.target.value)}
                >
                  {datasets?.map((dataset) => (
                    <MenuItem key={dataset.id} value={dataset.id}>
                      {dataset.name} ({dataset.records} records)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Predefined Analyses */}
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Quick Analysis
              </Typography>
              <Box sx={{ mb: 3 }}>
                {predefinedAnalyses.map((analysis) => (
                  <Button
                    key={analysis.id}
                    variant="outlined"
                    fullWidth
                    startIcon={analysis.icon}
                    onClick={() => handlePredefinedAnalysis(analysis.id)}
                    disabled={analysisMutation.isLoading || !selectedDataset}
                    sx={{
                      mb: 1,
                      justifyContent: 'flex-start',
                      borderColor: analysis.color,
                      color: analysis.color,
                      '&:hover': {
                        borderColor: analysis.color,
                        backgroundColor: `${analysis.color}10`,
                      },
                    }}
                  >
                    <Box textAlign="left">
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {analysis.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {analysis.description}
                      </Typography>
                    </Box>
                  </Button>
                ))}
              </Box>

              {/* Custom Analysis */}
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Custom Analysis
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Ask anything about your financial data... e.g., 'What are the main drivers of revenue growth?' or 'Identify cost optimization opportunities'"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                fullWidth
                startIcon={<Send />}
                onClick={handleCustomAnalysis}
                disabled={analysisMutation.isLoading || !selectedDataset || !customPrompt.trim()}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                {analysisMutation.isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  'Analyze'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Analysis Tips */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                <Lightbulb sx={{ mr: 1, verticalAlign: 'middle' }} />
                Analysis Tips
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Analytics color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Be Specific"
                    secondary="Ask detailed questions for better insights"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Insights color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Focus Areas"
                    secondary="Mention specific metrics or time periods"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Timeline color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Actionable Insights"
                    secondary="Ask for recommendations and next steps"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Analysis Results */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Analysis Results
              </Typography>
              
              {analysisMutation.isError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Analysis failed. Please try again or check your API configuration.
                </Alert>
              )}

              {analysisResults.length === 0 && !analysisMutation.isLoading && (
                <Box textAlign="center" py={4}>
                  <Psychology sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    No Analysis Yet
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Select a dataset and run an analysis to see AI-powered insights here
                  </Typography>
                </Box>
              )}

              {analysisMutation.isLoading && (
                <Box display="flex" alignItems="center" justifyContent="center" py={4}>
                  <CircularProgress sx={{ mr: 2 }} />
                  <Typography>Analyzing your data with AI...</Typography>
                </Box>
              )}

              {analysisResults.map((result, index) => (
                <Accordion key={index} defaultExpanded={index === 0}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box display="flex" alignItems="center" width="100%">
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {result.analysis_type === 'custom' ? 'Custom Analysis' : 
                           predefinedAnalyses.find(a => a.id === result.analysis_type)?.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(result.created_at).toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ ml: 'auto', mr: 2 }}>
                        <Chip
                          label={result.analysis_type}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      {result.result.custom_prompt && (
                        <Box mb={2}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            Query:
                          </Typography>
                          <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                            "{result.result.custom_prompt}"
                          </Typography>
                        </Box>
                      )}
                      
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        AI Insights:
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                        {result.result.insights}
                      </Typography>

                      {result.result.key_metrics && (
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Key Metrics:
                          </Typography>
                          <Box display="flex" flexWrap="wrap" gap={1}>
                            {Object.entries(result.result.key_metrics).map(([key, value]) => (
                              <Chip
                                key={key}
                                label={`${key}: ${value}`}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>
                      )}

                      {result.result.health_score && (
                        <Box mt={2}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            Health Score: {result.result.health_score}/10
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AIAnalysis;
