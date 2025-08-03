import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

function Settings() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Settings
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body1">
            Settings page - Coming soon!
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Settings;
