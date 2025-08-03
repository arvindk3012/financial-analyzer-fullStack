import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

function ExpenseAnalysis() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Expense Analysis
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body1">
            Expense analysis page - Coming soon!
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ExpenseAnalysis;
