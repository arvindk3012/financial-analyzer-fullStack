import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

function DataQuality() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Data Quality
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body1">
            Data quality assessment page - Coming soon!
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default DataQuality;
