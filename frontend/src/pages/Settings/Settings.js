import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Save,
  Visibility,
  VisibilityOff,
  Science,
  Email,
  Storage,
  Security,
  Notifications,
  Backup,
  CloudUpload,
  Settings as SettingsIcon,
  RestartAlt,
} from '@mui/icons-material';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Settings() {
  const [activeTab, setActiveTab] = useState(0);
  const [showPasswords, setShowPasswords] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Settings state
  const [settings, setSettings] = useState({
    // Database Configuration
    database: {
      host: 'localhost',
      port: '5432',
      name: 'financial_analyzer',
      username: 'postgres',
      password: '',
      ssl: false,
      connectionPool: 10,
    },
    // OpenAI Configuration
    openai: {
      apiKey: '',
      model: 'gpt-3.5-turbo',
      maxTokens: 1000,
      temperature: 0.7,
      enabled: true,
    },
    // Email Configuration
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: '587',
      username: '',
      password: '',
      fromEmail: '',
      fromName: 'Financial Analyzer',
      enableTLS: true,
      enabled: false,
    },
    // Application Settings
    app: {
      title: 'Financial Data Analyzer',
      description: 'Professional Financial Analysis Platform',
      version: '1.0.0',
      debug: false,
      maxFileSize: '10',
      sessionTimeout: '30',
      autoBackup: true,
      theme: 'light',
    },
    // Security Settings
    security: {
      enableTwoFactor: false,
      passwordExpiry: '90',
      maxLoginAttempts: '5',
      sessionEncryption: true,
      auditLogging: true,
    },
    // Notification Settings
    notifications: {
      emailAlerts: true,
      systemAlerts: true,
      dataQualityAlerts: true,
      weeklyReports: false,
      monthlyReports: true,
    },
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSettingChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async (section) => {
    try {
      // In a real app, this would save to backend
      console.log(`Saving ${section} settings:`, settings[section]);
      setSnackbar({
        open: true,
        message: `${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to save ${section} settings`,
        severity: 'error'
      });
    }
  };

  const testConnection = async (type) => {
    try {
      setSnackbar({
        open: true,
        message: `Testing ${type} connection...`,
        severity: 'info'
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSnackbar({
        open: true,
        message: `${type} connection test successful!`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `${type} connection test failed`,
        severity: 'error'
      });
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Application Settings
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Configure your application settings, integrations, and preferences
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<RestartAlt />}
          onClick={() => window.location.reload()}
          sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          Restart App
        </Button>
      </Box>

      {/* Settings Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab icon={<Storage />} label="Database" />
            <Tab icon={<Security />} label="OpenAI" />
            <Tab icon={<Email />} label="Email" />
            <Tab icon={<SettingsIcon />} label="Application" />
            <Tab icon={<Security />} label="Security" />
            <Tab icon={<Notifications />} label="Notifications" />
          </Tabs>
        </Box>

        {/* Database Settings */}
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Database Configuration
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Database Host"
                value={settings.database.host}
                onChange={(e) => handleSettingChange('database', 'host', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Port"
                type="number"
                value={settings.database.port}
                onChange={(e) => handleSettingChange('database', 'port', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Database Name"
                value={settings.database.name}
                onChange={(e) => handleSettingChange('database', 'name', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Username"
                value={settings.database.username}
                onChange={(e) => handleSettingChange('database', 'username', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                type={showPasswords.dbPassword ? 'text' : 'password'}
                value={settings.database.password}
                onChange={(e) => handleSettingChange('database', 'password', e.target.value)}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => togglePasswordVisibility('dbPassword')}>
                        {showPasswords.dbPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Connection Pool Size"
                type="number"
                value={settings.database.connectionPool}
                onChange={(e) => handleSettingChange('database', 'connectionPool', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.database.ssl}
                    onChange={(e) => handleSettingChange('database', 'ssl', e.target.checked)}
                  />
                }
                label="Enable SSL Connection"
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={() => handleSave('database')}
                >
                  Save Database Settings
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Science />}
                  onClick={() => testConnection('Database')}
                >
                  Test Connection
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* OpenAI Settings */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            OpenAI Configuration
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.openai.enabled}
                    onChange={(e) => handleSettingChange('openai', 'enabled', e.target.checked)}
                  />
                }
                label="Enable OpenAI Integration"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="OpenAI API Key"
                type={showPasswords.openaiKey ? 'text' : 'password'}
                value={settings.openai.apiKey}
                onChange={(e) => handleSettingChange('openai', 'apiKey', e.target.value)}
                margin="normal"
                disabled={!settings.openai.enabled}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => togglePasswordVisibility('openaiKey')}>
                        {showPasswords.openaiKey ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText="Get your API key from OpenAI Dashboard"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" disabled={!settings.openai.enabled}>
                <InputLabel>Model</InputLabel>
                <Select
                  value={settings.openai.model}
                  onChange={(e) => handleSettingChange('openai', 'model', e.target.value)}
                  label="Model"
                >
                  <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                  <MenuItem value="gpt-4">GPT-4</MenuItem>
                  <MenuItem value="gpt-4-turbo">GPT-4 Turbo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Max Tokens"
                type="number"
                value={settings.openai.maxTokens}
                onChange={(e) => handleSettingChange('openai', 'maxTokens', e.target.value)}
                margin="normal"
                disabled={!settings.openai.enabled}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Temperature (0-1)"
                type="number"
                inputProps={{ min: 0, max: 1, step: 0.1 }}
                value={settings.openai.temperature}
                onChange={(e) => handleSettingChange('openai', 'temperature', e.target.value)}
                margin="normal"
                disabled={!settings.openai.enabled}
                helperText="Higher values make output more random"
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={() => handleSave('openai')}
                >
                  Save OpenAI Settings
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Science />}
                  onClick={() => testConnection('OpenAI')}
                  disabled={!settings.openai.enabled || !settings.openai.apiKey}
                >
                  Test API Connection
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Email Settings */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Email Configuration
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.email.enabled}
                    onChange={(e) => handleSettingChange('email', 'enabled', e.target.checked)}
                  />
                }
                label="Enable Email Notifications"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SMTP Host"
                value={settings.email.smtpHost}
                onChange={(e) => handleSettingChange('email', 'smtpHost', e.target.value)}
                margin="normal"
                disabled={!settings.email.enabled}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SMTP Port"
                type="number"
                value={settings.email.smtpPort}
                onChange={(e) => handleSettingChange('email', 'smtpPort', e.target.value)}
                margin="normal"
                disabled={!settings.email.enabled}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Username"
                value={settings.email.username}
                onChange={(e) => handleSettingChange('email', 'username', e.target.value)}
                margin="normal"
                disabled={!settings.email.enabled}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="From Email"
                type="email"
                value={settings.email.fromEmail}
                onChange={(e) => handleSettingChange('email', 'fromEmail', e.target.value)}
                margin="normal"
                disabled={!settings.email.enabled}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.email.enableTLS}
                    onChange={(e) => handleSettingChange('email', 'enableTLS', e.target.checked)}
                    disabled={!settings.email.enabled}
                  />
                }
                label="Enable TLS/SSL"
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={() => handleSave('email')}
                >
                  Save Email Settings
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Science />}
                  onClick={() => testConnection('Email')}
                  disabled={!settings.email.enabled || !settings.email.username}
                >
                  Send Test Email
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Application Settings */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Application Configuration
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Application Title"
                value={settings.app.title}
                onChange={(e) => handleSettingChange('app', 'title', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Version"
                value={settings.app.version}
                onChange={(e) => handleSettingChange('app', 'version', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={settings.app.description}
                onChange={(e) => handleSettingChange('app', 'description', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Max File Size (MB)"
                type="number"
                value={settings.app.maxFileSize}
                onChange={(e) => handleSettingChange('app', 'maxFileSize', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Session Timeout (minutes)"
                type="number"
                value={settings.app.sessionTimeout}
                onChange={(e) => handleSettingChange('app', 'sessionTimeout', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Theme</InputLabel>
                <Select
                  value={settings.app.theme}
                  onChange={(e) => handleSettingChange('app', 'theme', e.target.value)}
                  label="Theme"
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="auto">Auto</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.app.debug}
                    onChange={(e) => handleSettingChange('app', 'debug', e.target.checked)}
                  />
                }
                label="Enable Debug Mode"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.app.autoBackup}
                    onChange={(e) => handleSettingChange('app', 'autoBackup', e.target.checked)}
                  />
                }
                label="Enable Auto Backup"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => handleSave('app')}
              >
                Save Application Settings
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Security Settings */}
        <TabPanel value={activeTab} index={4}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Security Configuration
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.security.enableTwoFactor}
                    onChange={(e) => handleSettingChange('security', 'enableTwoFactor', e.target.checked)}
                  />
                }
                label="Enable Two-Factor Authentication"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password Expiry (days)"
                type="number"
                value={settings.security.passwordExpiry}
                onChange={(e) => handleSettingChange('security', 'passwordExpiry', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Max Login Attempts"
                type="number"
                value={settings.security.maxLoginAttempts}
                onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.security.sessionEncryption}
                    onChange={(e) => handleSettingChange('security', 'sessionEncryption', e.target.checked)}
                  />
                }
                label="Enable Session Encryption"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.security.auditLogging}
                    onChange={(e) => handleSettingChange('security', 'auditLogging', e.target.checked)}
                  />
                }
                label="Enable Audit Logging"
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Security Recommendations:</strong>
                  <br />• Enable two-factor authentication for enhanced security
                  <br />• Set password expiry to 90 days or less
                  <br />• Limit login attempts to prevent brute force attacks
                  <br />• Always keep audit logging enabled
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => handleSave('security')}
              >
                Save Security Settings
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Notification Settings */}
        <TabPanel value={activeTab} index={5}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Notification Preferences
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                Alert Notifications
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Email Alerts"
                    secondary="Receive important alerts via email"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.emailAlerts}
                      onChange={(e) => handleSettingChange('notifications', 'emailAlerts', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="System Alerts"
                    secondary="Get notified about system events"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.systemAlerts}
                      onChange={(e) => handleSettingChange('notifications', 'systemAlerts', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Data Quality Alerts"
                    secondary="Alerts for data quality issues"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.dataQualityAlerts}
                      onChange={(e) => handleSettingChange('notifications', 'dataQualityAlerts', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                Report Notifications
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Weekly Reports"
                    secondary="Receive weekly financial summaries"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.weeklyReports}
                      onChange={(e) => handleSettingChange('notifications', 'weeklyReports', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Monthly Reports"
                    secondary="Receive comprehensive monthly reports"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.monthlyReports}
                      onChange={(e) => handleSettingChange('notifications', 'monthlyReports', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => handleSave('notifications')}
              >
                Save Notification Settings
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Settings;
