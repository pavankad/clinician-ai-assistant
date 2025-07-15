import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Search,
  People,
  Assignment,
  TrendingUp,
  Schedule,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock data for recent activities and stats
  const recentActivities = [
    { id: 1, patient: 'John Doe', action: 'Updated treatment plan', time: '2 hours ago' },
    { id: 2, patient: 'Jane Smith', action: 'Reviewed lab results', time: '4 hours ago' },
    { id: 3, patient: 'Robert Johnson', action: 'Added new diagnosis', time: '1 day ago' },
    { id: 4, patient: 'Emily Davis', action: 'Updated demographics', time: '2 days ago' },
  ];

  const stats = [
    { label: 'Total Patients', value: '1,247', icon: People, color: '#1976d2' },
    { label: 'Pending Reviews', value: '23', icon: Assignment, color: '#ed6c02' },
    { label: 'This Week', value: '89', icon: TrendingUp, color: '#2e7d32' },
    { label: 'Scheduled', value: '15', icon: Schedule, color: '#9c27b0' },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to your patient management dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconComponent sx={{ color: stat.color, mr: 1 }} />
                    <Typography variant="h6" component="div">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Search />}
                  fullWidth
                  onClick={() => navigate('/patients')}
                  size="large"
                >
                  Search Patients
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<People />}
                  fullWidth
                  size="large"
                >
                  Recent Patients
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Assignment />}
                  fullWidth
                  size="large"
                >
                  Pending Reviews
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto' }}>
                <List>
                  {recentActivities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem>
                        <ListItemText
                          primary={`${activity.patient} - ${activity.action}`}
                          secondary={activity.time}
                        />
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
