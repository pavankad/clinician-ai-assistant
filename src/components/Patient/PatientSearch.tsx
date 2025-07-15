import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { Search, Person } from '@mui/icons-material';
import { PatientSearchResult } from '../../types/patient';

const PatientSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchCriteria, setSearchCriteria] = useState({
    firstName: '',
    lastName: '',
  });
  const [searchResults, setSearchResults] = useState<PatientSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Mock search function - replace with actual API call
  const mockPatients: PatientSearchResult[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1985-03-15',
      gender: 'Male',
      lastVisit: '2024-07-10',
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '1990-08-22',
      gender: 'Female',
      lastVisit: '2024-07-12',
    },
    {
      id: '3',
      firstName: 'Robert',
      lastName: 'Johnson',
      dateOfBirth: '1978-12-05',
      gender: 'Male',
      lastVisit: '2024-07-08',
    },
    {
      id: '4',
      firstName: 'Emily',
      lastName: 'Davis',
      dateOfBirth: '1992-06-18',
      gender: 'Female',
      lastVisit: '2024-07-11',
    },
  ];

  const handleSearch = async () => {
    if (!searchCriteria.firstName.trim() && !searchCriteria.lastName.trim()) {
      setError('Please enter at least a first name or last name');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock search logic
      const results = mockPatients.filter(patient => {
        const firstNameMatch = !searchCriteria.firstName.trim() || 
          patient.firstName.toLowerCase().includes(searchCriteria.firstName.toLowerCase());
        const lastNameMatch = !searchCriteria.lastName.trim() || 
          patient.lastName.toLowerCase().includes(searchCriteria.lastName.toLowerCase());
        
        return firstNameMatch && lastNameMatch;
      });

      setSearchResults(results);
    } catch (error) {
      setError('Search failed. Please try again.');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patientId: string) => {
    navigate(`/patient/${patientId}`);
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Patient Search
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Search for patients by first name, last name, or both
      </Typography>

      {/* Search Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="end">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="First Name"
              value={searchCriteria.firstName}
              onChange={handleInputChange('firstName')}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Last Name"
              value={searchCriteria.lastName}
              onChange={handleInputChange('lastName')}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Search />}
              onClick={handleSearch}
              disabled={loading}
              fullWidth
              size="large"
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search Results */}
      {hasSearched && !loading && (
        <Paper>
          <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6">
              Search Results ({searchResults.length} found)
            </Typography>
          </Box>
          
          {searchResults.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Person sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No patients found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Date of Birth</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>Last Visit</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchResults.map((patient) => (
                    <TableRow key={patient.id} hover>
                      <TableCell>
                        <Typography variant="subtitle1">
                          {patient.firstName} {patient.lastName}
                        </Typography>
                      </TableCell>
                      <TableCell>{patient.dateOfBirth}</TableCell>
                      <TableCell>
                        <Chip 
                          label={patient.gender} 
                          size="small" 
                          color={patient.gender === 'Male' ? 'primary' : 'secondary'}
                        />
                      </TableCell>
                      <TableCell>{patient.lastVisit || 'N/A'}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handlePatientSelect(patient.id)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default PatientSearch;
