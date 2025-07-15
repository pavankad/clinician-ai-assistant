import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Person,
  History,
  LocalHospital,
  MedicalServices,
  Science,
  Edit,
  Add,
  Save,
  Cancel,
} from '@mui/icons-material';
import { Patient, Demographics, HistoryEntry, Diagnosis, Treatment, LabResult } from '../../types/patient';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`patient-tabpanel-${index}`}
      aria-labelledby={`patient-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const PatientDetails: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [editingDemographics, setEditingDemographics] = useState(false);
  const [editedDemographics, setEditedDemographics] = useState<Demographics | null>(null);

  // Mock patient data - replace with actual API call
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockPatient: Patient = {
          demographics: {
            id: patientId || '1',
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1985-03-15',
            gender: 'Male',
            phoneNumber: '+1-555-0123',
            email: 'john.doe@email.com',
            address: {
              street: '123 Main St',
              city: 'Anytown',
              state: 'CA',
              zipCode: '12345',
              country: 'USA',
            },
            emergencyContact: {
              name: 'Jane Doe',
              relationship: 'Spouse',
              phoneNumber: '+1-555-0124',
            },
            insurance: {
              provider: 'Blue Cross Blue Shield',
              policyNumber: 'BCBS123456789',
              groupNumber: 'GRP001',
            },
          },
          history: [
            {
              id: '1',
              date: '2020-05-15',
              type: 'Surgery',
              description: 'Appendectomy',
              notes: 'Routine laparoscopic appendectomy, no complications',
              provider: 'Dr. Smith',
            },
            {
              id: '2',
              date: '2018-03-10',
              type: 'Chronic Condition',
              description: 'Hypertension',
              notes: 'Diagnosed with essential hypertension, family history positive',
              provider: 'Dr. Johnson',
            },
          ],
          diagnoses: [
            {
              id: '1',
              icdCode: 'I10',
              description: 'Essential Hypertension',
              diagnosisDate: '2018-03-10',
              status: 'Active',
              severity: 'Mild',
              diagnosingProvider: 'Dr. Johnson',
            },
            {
              id: '2',
              icdCode: 'K35.9',
              description: 'Acute appendicitis, unspecified',
              diagnosisDate: '2020-05-15',
              status: 'Resolved',
              diagnosingProvider: 'Dr. Smith',
            },
          ],
          treatments: [
            {
              id: '1',
              type: 'Medication',
              name: 'Lisinopril',
              description: 'ACE inhibitor for hypertension',
              startDate: '2018-03-10',
              dosage: '10mg',
              frequency: 'Once daily',
              status: 'Active',
              prescribingProvider: 'Dr. Johnson',
            },
            {
              id: '2',
              type: 'Surgery',
              name: 'Laparoscopic Appendectomy',
              description: 'Surgical removal of appendix',
              startDate: '2020-05-15',
              endDate: '2020-05-15',
              status: 'Completed',
              prescribingProvider: 'Dr. Smith',
            },
          ],
          labs: [
            {
              id: '1',
              testName: 'Complete Blood Count',
              testCode: 'CBC',
              value: 'Normal',
              status: 'Normal',
              orderDate: '2024-07-01',
              resultDate: '2024-07-02',
              orderingProvider: 'Dr. Johnson',
              labFacility: 'LabCorp',
            },
            {
              id: '2',
              testName: 'Blood Pressure',
              value: '130/85',
              unit: 'mmHg',
              referenceRange: '<120/80',
              status: 'Abnormal',
              orderDate: '2024-07-10',
              resultDate: '2024-07-10',
              orderingProvider: 'Dr. Johnson',
            },
          ],
          lastUpdated: '2024-07-14',
        };

        setPatient(mockPatient);
      } catch (error) {
        setError('Failed to load patient data');
        console.error('Error fetching patient:', error);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEditDemographics = () => {
    setEditedDemographics({ ...patient!.demographics });
    setEditingDemographics(true);
  };

  const handleSaveDemographics = () => {
    if (editedDemographics) {
      setPatient(prev => prev ? { ...prev, demographics: editedDemographics } : null);
      setEditingDemographics(false);
      setEditedDemographics(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingDemographics(false);
    setEditedDemographics(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !patient) {
    return (
      <Alert severity="error">
        {error || 'Patient not found'}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {patient.demographics.firstName} {patient.demographics.lastName}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Patient ID: {patient.demographics.id} • Last Updated: {patient.lastUpdated}
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="patient information tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<Person />} label="Demographics" />
          <Tab icon={<History />} label="History" />
          <Tab icon={<LocalHospital />} label="Diagnoses" />
          <Tab icon={<MedicalServices />} label="Treatments" />
          <Tab icon={<Science />} label="Labs" />
        </Tabs>

        {/* Demographics Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Demographics Information</Typography>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={handleEditDemographics}
              disabled={editingDemographics}
            >
              Edit
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Personal Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">First Name</Typography>
                      <Typography variant="body1">{patient.demographics.firstName}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Last Name</Typography>
                      <Typography variant="body1">{patient.demographics.lastName}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                      <Typography variant="body1">{patient.demographics.dateOfBirth}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Gender</Typography>
                      <Typography variant="body1">{patient.demographics.gender}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Phone</Typography>
                      <Typography variant="body1">{patient.demographics.phoneNumber || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{patient.demographics.email || 'N/A'}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Contact Information</Typography>
                  {patient.demographics.address && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Address</Typography>
                      <Typography variant="body1">
                        {patient.demographics.address.street}<br />
                        {patient.demographics.address.city}, {patient.demographics.address.state} {patient.demographics.address.zipCode}<br />
                        {patient.demographics.address.country}
                      </Typography>
                    </Box>
                  )}
                  {patient.demographics.emergencyContact && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">Emergency Contact</Typography>
                      <Typography variant="body1">
                        {patient.demographics.emergencyContact.name} ({patient.demographics.emergencyContact.relationship})<br />
                        {patient.demographics.emergencyContact.phoneNumber}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {patient.demographics.insurance && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Insurance Information</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">Provider</Typography>
                        <Typography variant="body1">{patient.demographics.insurance.provider}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">Policy Number</Typography>
                        <Typography variant="body1">{patient.demographics.insurance.policyNumber}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">Group Number</Typography>
                        <Typography variant="body1">{patient.demographics.insurance.groupNumber || 'N/A'}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        {/* History Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Medical History</Typography>
            <Button variant="outlined" startIcon={<Add />}>
              Add Entry
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Provider</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patient.history.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>
                      <Chip label={entry.type} size="small" />
                    </TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>{entry.provider || 'N/A'}</TableCell>
                    <TableCell>{entry.notes || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Diagnoses Tab */}
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Diagnoses</Typography>
            <Button variant="outlined" startIcon={<Add />}>
              Add Diagnosis
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ICD Code</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Provider</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patient.diagnoses.map((diagnosis) => (
                  <TableRow key={diagnosis.id}>
                    <TableCell>{diagnosis.icdCode}</TableCell>
                    <TableCell>{diagnosis.description}</TableCell>
                    <TableCell>{diagnosis.diagnosisDate}</TableCell>
                    <TableCell>
                      <Chip 
                        label={diagnosis.status} 
                        size="small"
                        color={diagnosis.status === 'Active' ? 'error' : 'success'}
                      />
                    </TableCell>
                    <TableCell>{diagnosis.severity || 'N/A'}</TableCell>
                    <TableCell>{diagnosis.diagnosingProvider || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Treatments Tab */}
        <TabPanel value={activeTab} index={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Treatments</Typography>
            <Button variant="outlined" startIcon={<Add />}>
              Add Treatment
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>Dosage/Frequency</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Provider</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patient.treatments.map((treatment) => (
                  <TableRow key={treatment.id}>
                    <TableCell>
                      <Chip label={treatment.type} size="small" />
                    </TableCell>
                    <TableCell>{treatment.name}</TableCell>
                    <TableCell>{treatment.description}</TableCell>
                    <TableCell>{treatment.startDate}</TableCell>
                    <TableCell>
                      {treatment.dosage && treatment.frequency ? 
                        `${treatment.dosage} ${treatment.frequency}` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={treatment.status} 
                        size="small"
                        color={treatment.status === 'Active' ? 'primary' : 'default'}
                      />
                    </TableCell>
                    <TableCell>{treatment.prescribingProvider || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Labs Tab */}
        <TabPanel value={activeTab} index={4}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Laboratory Results</Typography>
            <Button variant="outlined" startIcon={<Add />}>
              Add Lab Result
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Test Name</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Reference Range</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Order Date</TableCell>
                  <TableCell>Result Date</TableCell>
                  <TableCell>Provider</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patient.labs.map((lab) => (
                  <TableRow key={lab.id}>
                    <TableCell>{lab.testName}</TableCell>
                    <TableCell>
                      {lab.value} {lab.unit && `${lab.unit}`}
                    </TableCell>
                    <TableCell>{lab.referenceRange || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={lab.status} 
                        size="small"
                        color={
                          lab.status === 'Critical' ? 'error' :
                          lab.status === 'Abnormal' ? 'warning' :
                          lab.status === 'Normal' ? 'success' : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>{lab.orderDate}</TableCell>
                    <TableCell>{lab.resultDate || 'Pending'}</TableCell>
                    <TableCell>{lab.orderingProvider || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Edit Demographics Dialog */}
      <Dialog open={editingDemographics} onClose={handleCancelEdit} maxWidth="md" fullWidth>
        <DialogTitle>Edit Demographics</DialogTitle>
        <DialogContent>
          {editedDemographics && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={editedDemographics.firstName}
                  onChange={(e) => setEditedDemographics({
                    ...editedDemographics,
                    firstName: e.target.value
                  })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={editedDemographics.lastName}
                  onChange={(e) => setEditedDemographics({
                    ...editedDemographics,
                    lastName: e.target.value
                  })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={editedDemographics.phoneNumber || ''}
                  onChange={(e) => setEditedDemographics({
                    ...editedDemographics,
                    phoneNumber: e.target.value
                  })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={editedDemographics.email || ''}
                  onChange={(e) => setEditedDemographics({
                    ...editedDemographics,
                    email: e.target.value
                  })}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button onClick={handleSaveDemographics} variant="contained" startIcon={<Save />}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientDetails;
