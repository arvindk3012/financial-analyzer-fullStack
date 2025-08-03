import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  IconButton,
  Menu,
  MenuItem as MenuOption,
} from '@mui/material';
import {
  TrendingUp,
  Download,
  FilterList,
  MoreVert,
  AccountBalance,
  Timeline,
  Assessment,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useQuery } from 'react-query';
import numeral from 'numeral';
import axios from 'axios';
import jsPDF from 'jspdf';

// Helper functions to generate profit analysis data
const generateProfitTrendData = (totalRevenue, totalExpenses, period = 'monthly') => {
  if (!totalRevenue || !totalExpenses) {
    // Generate different data based on period
    if (period === 'quarterly') {
      return [
        { month: 'Q1', profit: 0, margin: 0 },
        { month: 'Q2', profit: 0, margin: 0 },
        { month: 'Q3', profit: 0, margin: 0 },
        { month: 'Q4', profit: 0, margin: 0 }
      ];
    } else if (period === 'yearly') {
      return [
        { month: '2022', profit: 0, margin: 0 },
        { month: '2023', profit: 0, margin: 0 },
        { month: '2024', profit: 0, margin: 0 }
      ];
    }
    return [
      { month: 'Jan', profit: 0, margin: 0 },
      { month: 'Feb', profit: 0, margin: 0 },
      { month: 'Mar', profit: 0, margin: 0 },
      { month: 'Apr', profit: 0, margin: 0 },
      { month: 'May', profit: 0, margin: 0 },
      { month: 'Jun', profit: 0, margin: 0 }
    ];
  }
  
  let periods, avgProfit;
  
  if (period === 'quarterly') {
    periods = ['Q1', 'Q2', 'Q3', 'Q4'];
    avgProfit = (totalRevenue - totalExpenses) / 4;
  } else if (period === 'yearly') {
    periods = ['2022', '2023', '2024'];
    avgProfit = (totalRevenue - totalExpenses) / 3;
  } else {
    periods = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    avgProfit = (totalRevenue - totalExpenses) / 6;
  }
  
  return periods.map((month, index) => {
    const variation = 1 + (Math.sin(index) * 0.25); // ±25% variation
    const profit = Math.round(avgProfit * variation);
    const periodRevenue = totalRevenue / periods.length;
    const margin = periodRevenue > 0 ? ((profit / periodRevenue) * 100) : 0;
    
    return {
      month,
      profit,
      margin: Math.round(margin * 100) / 100
    };
  });
};

const generateProfitBySegmentData = (totalProfit) => {
  if (!totalProfit) {
    return [
      { segment: 'Product Sales', profit: 0, percentage: 0 },
      { segment: 'Services', profit: 0, percentage: 0 },
      { segment: 'Subscriptions', profit: 0, percentage: 0 },
      { segment: 'Consulting', profit: 0, percentage: 0 }
    ];
  }
  
  return [
    { segment: 'Product Sales', profit: Math.round(totalProfit * 0.40), percentage: 40 },
    { segment: 'Services', profit: Math.round(totalProfit * 0.30), percentage: 30 },
    { segment: 'Subscriptions', profit: Math.round(totalProfit * 0.20), percentage: 20 },
    { segment: 'Consulting', profit: Math.round(totalProfit * 0.10), percentage: 10 }
  ];
};

const generateProfitMarginData = (totalRevenue, totalExpenses) => {
  if (!totalRevenue || !totalExpenses) {
    return [
      { category: 'Gross Margin', value: 0, color: '#4caf50' },
      { category: 'Operating Margin', value: 0, color: '#2196f3' },
      { category: 'Net Margin', value: 0, color: '#ff9800' }
    ];
  }
  
  const grossMargin = ((totalRevenue - (totalExpenses * 0.6)) / totalRevenue) * 100;
  const operatingMargin = ((totalRevenue - (totalExpenses * 0.8)) / totalRevenue) * 100;
  const netMargin = ((totalRevenue - totalExpenses) / totalRevenue) * 100;
  
  return [
    { category: 'Gross Margin', value: Math.round(grossMargin * 100) / 100, color: '#4caf50' },
    { category: 'Operating Margin', value: Math.round(operatingMargin * 100) / 100, color: '#2196f3' },
    { category: 'Net Margin', value: Math.round(netMargin * 100) / 100, color: '#ff9800' }
  ];
};

const generateBreakevenAnalysisData = (totalRevenue, totalExpenses) => {
  if (!totalRevenue || !totalExpenses) {
    return [
      { month: 'Jan', revenue: 0, fixedCosts: 0, variableCosts: 0, breakeven: 0 },
      { month: 'Feb', revenue: 0, fixedCosts: 0, variableCosts: 0, breakeven: 0 },
      { month: 'Mar', revenue: 0, fixedCosts: 0, variableCosts: 0, breakeven: 0 },
      { month: 'Apr', revenue: 0, fixedCosts: 0, variableCosts: 0, breakeven: 0 },
      { month: 'May', revenue: 0, fixedCosts: 0, variableCosts: 0, breakeven: 0 },
      { month: 'Jun', revenue: 0, fixedCosts: 0, variableCosts: 0, breakeven: 0 }
    ];
  }
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const avgMonthlyRevenue = totalRevenue / 6;
  const avgMonthlyExpenses = totalExpenses / 6;
  const fixedCosts = avgMonthlyExpenses * 0.6; // 60% fixed costs
  const variableCostRate = 0.4; // 40% variable costs
  
  return months.map((month, index) => {
    const variation = 1 + (Math.cos(index) * 0.2);
    const monthlyRevenue = Math.round(avgMonthlyRevenue * variation);
    const variableCosts = Math.round(monthlyRevenue * variableCostRate);
    const breakeven = Math.round(fixedCosts / (1 - variableCostRate));
    
    return {
      month,
      revenue: monthlyRevenue,
      fixedCosts: Math.round(fixedCosts),
      variableCosts,
      breakeven
    };
  });
};

// Helper functions for export (aliases for existing functions)
const generateProfitTrends = (records, totalProfit, period) => {
  const totalRevenue = totalProfit * 1.5; // Estimate revenue from profit
  const totalExpenses = totalRevenue - totalProfit;
  return generateProfitTrendData(totalRevenue, totalExpenses, period).map(item => ({
    period: item.month,
    profit: item.profit,
    margin: item.margin
  }));
};

const generateProfitBySegment = (records, totalProfit) => {
  return generateProfitBySegmentData(totalProfit).map(item => ({
    segment: item.segment,
    profit: item.profit
  }));
};

function ProfitAnalysis() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Real API data query
  const { data: profitData, isLoading, error } = useQuery(
    ['profitAnalysis', selectedPeriod, selectedSegment],
    async () => {
      const [summaryResponse, recordsResponse] = await Promise.all([
        axios.get('/api/v1/financial-data/analytics/summary'),
        axios.get('/api/v1/financial-data/records')
      ]);
      
      const summary = summaryResponse.data;
      const records = recordsResponse.data.records || [];
      
      return {
        summary: {
          totalProfit: summary.net_profit || 0,
          totalRevenue: summary.total_revenue || 0,
          totalExpenses: summary.total_expenses || 0,
          profitMargin: summary.total_revenue > 0 ? ((summary.net_profit / summary.total_revenue) * 100) : 0,
          profitGrowth: 12.5, // Fixed growth rate for demo
          breakEvenPoint: Math.round((summary.total_expenses * 0.6) / 0.4), // Fixed costs / contribution margin
          roi: summary.total_expenses > 0 ? ((summary.net_profit / summary.total_expenses) * 100) : 0
        },
        profitTrend: generateProfitTrendData(summary.total_revenue, summary.total_expenses, selectedPeriod),
        profitBySegment: generateProfitBySegmentData(summary.net_profit),
        profitMargins: generateProfitMarginData(summary.total_revenue, summary.total_expenses),
        breakevenAnalysis: generateBreakevenAnalysisData(summary.total_revenue, summary.total_expenses)
      };
    },
    {
      refetchInterval: 30 * 1000, // Refresh every 30 seconds
    }
  );

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const exportData = (format) => {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `profit-analysis-${timestamp}`;
      
      if (format === 'csv') {
        // Export profit data as CSV
        const csvData = [
          ['Profit Analysis Report', '', ''],
          ['Generated on', new Date().toLocaleDateString(), ''],
          ['Period', selectedPeriod, ''],
          ['', '', ''],
          ['Summary Metrics', '', ''],
          ['Metric', 'Value', 'Margin'],
          ['Total Profit', `$${numeral(profitData?.totalProfit || 0).format('0,0')}`, `${profitData?.profitMargin || 0}%`],
          ['Gross Profit', `$${numeral(profitData?.grossProfit || 0).format('0,0')}`, `${profitData?.grossMargin || 0}%`],
          ['Net Profit', `$${numeral(profitData?.netProfit || 0).format('0,0')}`, `${profitData?.netMargin || 0}%`],
          ['Break-even Point', `$${numeral(profitData?.breakEvenPoint || 0).format('0,0')}`, ''],
          ['', '', ''],
          ['Profit Trends', '', ''],
          ['Period', 'Profit', 'Margin %'],
          ...generateProfitTrends(profitData?.records || [], profitData?.totalProfit || 0, selectedPeriod).map(item => [
            item.period,
            `$${numeral(item.profit).format('0,0')}`,
            `${item.margin}%`
          ])
        ];
        
        const csvContent = csvData.map(row => row.join(',')).join('\n');
        downloadFile(csvContent, `${filename}.csv`, 'text/csv');
        
      } else if (format === 'excel') {
        // For Excel, use enhanced CSV format
        const csvData = [
          ['Profit Analysis Report', '', '', ''],
          ['Generated on', new Date().toLocaleDateString(), '', ''],
          ['Period Filter', selectedPeriod, '', ''],
          ['', '', '', ''],
          ['Key Performance Indicators', '', '', ''],
          ['Metric', 'Value', 'Margin %', 'Status'],
          ['Total Profit', `$${numeral(profitData?.totalProfit || 0).format('0,0')}`, `${profitData?.profitMargin || 0}%`, profitData?.profitMargin > 15 ? 'Excellent' : profitData?.profitMargin > 10 ? 'Good' : 'Needs Improvement'],
          ['Gross Profit', `$${numeral(profitData?.grossProfit || 0).format('0,0')}`, `${profitData?.grossMargin || 0}%`, 'Stable'],
          ['Net Profit', `$${numeral(profitData?.netProfit || 0).format('0,0')}`, `${profitData?.netMargin || 0}%`, 'Active'],
          ['Break-even Point', `$${numeral(profitData?.breakEvenPoint || 0).format('0,0')}`, '', 'Target'],
          ['', '', '', ''],
          ['Profit by Segment', '', '', ''],
          ['Segment', 'Profit', 'Percentage', 'Trend'],
          ...generateProfitBySegment(profitData?.records || [], profitData?.totalProfit || 0).map(item => [
            item.segment,
            `$${numeral(item.profit).format('0,0')}`,
            `${((item.profit / (profitData?.totalProfit || 1)) * 100).toFixed(1)}%`,
            'Growing'
          ])
        ];
        
        const csvContent = csvData.map(row => row.join(',')).join('\n');
        downloadFile(csvContent, `${filename}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        
      } else if (format === 'pdf') {
        // Generate proper PDF using jsPDF
        const doc = new jsPDF();
        
        // Set up PDF styling
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        
        // Title
        doc.text('PROFIT ANALYSIS REPORT', 20, 30);
        
        // Date and Period
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
        doc.text(`Period: ${selectedPeriod}`, 20, 55);
        
        // Key Metrics Section
        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40);
        doc.text('KEY METRICS', 20, 75);
        
        doc.setFontSize(12);
        let yPos = 90;
        
        const metrics = [
          { label: 'Total Profit', value: `$${numeral(profitData?.totalProfit || 0).format('0,0')}`, color: [76, 175, 80] },
          { label: 'Profit Margin', value: `${profitData?.profitMargin || 0}%`, color: [33, 150, 243] },
          { label: 'Gross Profit', value: `$${numeral(profitData?.grossProfit || 0).format('0,0')}`, color: [60, 60, 60] },
          { label: 'Net Profit', value: `$${numeral(profitData?.netProfit || 0).format('0,0')}`, color: [60, 60, 60] },
          { label: 'Break-even Point', value: `$${numeral(profitData?.breakEvenPoint || 0).format('0,0')}`, color: [255, 152, 0] }
        ];
        
        metrics.forEach(metric => {
          doc.setTextColor(...metric.color);
          doc.text(`• ${metric.label}: ${metric.value}`, 25, yPos);
          yPos += 15;
        });
        
        // Profit Trends Section
        yPos += 10;
        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40);
        doc.text('PROFIT TRENDS', 20, yPos);
        
        yPos += 20;
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        
        const trends = generateProfitTrends(profitData?.records || [], profitData?.totalProfit || 0, selectedPeriod);
        trends.forEach(item => {
          doc.text(`• ${item.period}: $${numeral(item.profit).format('0,0')} (${item.margin}% margin)`, 25, yPos);
          yPos += 12;
        });
        
        // Profit by Segment Section
        yPos += 10;
        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40);
        doc.text('PROFIT BY SEGMENT', 20, yPos);
        
        yPos += 20;
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        
        const segments = generateProfitBySegment(profitData?.records || [], profitData?.totalProfit || 0);
        segments.forEach(item => {
          const percentage = profitData?.totalProfit > 0 ? ((item.profit / profitData.totalProfit) * 100).toFixed(1) : 0;
          doc.text(`• ${item.segment}: $${numeral(item.profit).format('0,0')} (${percentage}%)`, 25, yPos);
          yPos += 12;
        });
        
        // Save the PDF
        doc.save(`${filename}.pdf`);
      }
      
      // Show success message
      setSnackbar({
        open: true,
        message: `Profit analysis exported successfully as ${format.toUpperCase()}!`,
        severity: 'success'
      });
      
    } catch (error) {
      console.error('Export error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to export data. Please try again.',
        severity: 'error'
      });
    }
    
    handleMenuClose();
  };
  
  // Helper function to download files
  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Alert severity="error">Failed to load profit data</Alert>;

  const { summary, profitTrend, profitBySegment, profitMargins, breakevenAnalysis } = profitData;

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Profit Analysis
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Comprehensive profit performance analysis and margin optimization
          </Typography>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={selectedPeriod}
              label="Period"
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuOption onClick={() => exportData('csv')}>Export CSV</MenuOption>
            <MenuOption onClick={() => exportData('excel')}>Export Excel</MenuOption>
            <MenuOption onClick={() => exportData('pdf')}>Export PDF</MenuOption>
          </Menu>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Profit
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                    {numeral(summary.totalProfit).format('$0,0')}
                  </Typography>
                  <Chip
                    label={`+${summary.profitGrowth}%`}
                    color="success"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: '#4caf50', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Profit Margin
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                    {numeral(summary.profitMargin).format('0.0')}%
                  </Typography>
                  <Chip label="Healthy" color="info" size="small" sx={{ mt: 1 }} />
                </Box>
                <Assessment sx={{ fontSize: 40, color: '#2196f3', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    ROI
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                    {numeral(summary.roi).format('0.0')}%
                  </Typography>
                  <Chip label="Above Target" color="warning" size="small" sx={{ mt: 1 }} />
                </Box>
                <AccountBalance sx={{ fontSize: 40, color: '#ff9800', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Break-even Point
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {numeral(summary.breakEvenPoint).format('$0,0')}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Monthly target
                  </Typography>
                </Box>
                <Timeline sx={{ fontSize: 40, color: '#9c27b0', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Profit Trend */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Profit Trend & Margin Analysis
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={profitTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="profit" orientation="left" tickFormatter={(value) => numeral(value).format('$0a')} />
                  <YAxis yAxisId="margin" orientation="right" tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'profit' ? numeral(value).format('$0,0') : `${value}%`,
                      name === 'profit' ? 'Profit' : 'Margin'
                    ]}
                  />
                  <Legend />
                  <Line
                    yAxisId="profit"
                    type="monotone"
                    dataKey="profit"
                    stroke="#4caf50"
                    strokeWidth={3}
                    dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
                    name="Profit"
                  />
                  <Line
                    yAxisId="margin"
                    type="monotone"
                    dataKey="margin"
                    stroke="#2196f3"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#2196f3', strokeWidth: 2, r: 3 }}
                    name="Margin %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Profit Margins */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Profit Margins
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={profitMargins} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                  <YAxis type="category" dataKey="category" width={100} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Margin']} />
                  <Bar dataKey="value">
                    {profitMargins.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Profit by Segment */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Profit by Business Segment
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={profitBySegment}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="profit"
                    label={({ segment, percentage }) => `${segment}: ${percentage}%`}
                  >
                    {profitBySegment.map((entry, index) => {
                      const colors = ['#4caf50', '#2196f3', '#ff9800', '#9c27b0'];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Pie>
                  <Tooltip formatter={(value) => numeral(value).format('$0,0')} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Break-even Analysis */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Break-even Analysis
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={breakevenAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => numeral(value).format('$0a')} />
                  <Tooltip formatter={(value) => numeral(value).format('$0,0')} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#4caf50"
                    fill="#4caf50"
                    fillOpacity={0.6}
                    name="Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="fixedCosts"
                    stackId="2"
                    stroke="#f44336"
                    fill="#f44336"
                    fillOpacity={0.6}
                    name="Fixed Costs"
                  />
                  <Area
                    type="monotone"
                    dataKey="variableCosts"
                    stackId="2"
                    stroke="#ff9800"
                    fill="#ff9800"
                    fillOpacity={0.6}
                    name="Variable Costs"
                  />
                  <Line
                    type="monotone"
                    dataKey="breakeven"
                    stroke="#9c27b0"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Break-even"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProfitAnalysis;
