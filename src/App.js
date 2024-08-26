import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, Button, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/';

function App() {
  const [courses, setCourses] = useState([]);
  const [instances, setInstances] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: '', code: '', description: '' });
  const [newInstance, setNewInstance] = useState({ courseId: '', year: '', semester: '' });
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const response = await axios.get(`${API_BASE_URL}/courses`);
    setCourses(response.data);
  };

  const addCourse = async () => {
    await axios.post(`${API_BASE_URL}/courses`, newCourse);
    setNewCourse({ title: '', code: '', description: '' });
    fetchCourses();
  };

  const addInstance = async () => {
    await axios.post(`${API_BASE_URL}/instances`, newInstance);
    setNewInstance({ courseId: '', year: '', semester: '' });
    fetchInstances(newInstance.year, newInstance.semester);
  };

  const fetchInstances = async (year, semester) => {
    const response = await axios.get(`${API_BASE_URL}/instances/${year}/${semester}`);
    setInstances(response.data);
  };

  const deleteCourse = async (id) => {
    await axios.delete(`${API_BASE_URL}/courses/${id}`);
    fetchCourses();
  };

  const deleteInstance = async (year, semester, id) => {
    await axios.delete(`${API_BASE_URL}/instances/${year}/${semester}/${id}`);
    fetchInstances(year, semester);
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <TextField
          label="Course title"
          value={newCourse.title}
          onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Course code"
          value={newCourse.code}
          onChange={(e) => setNewCourse({...newCourse, code: e.target.value})}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Course description"
          value={newCourse.description}
          onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={addCourse}>
          Add course
        </Button>
      </Box>

      <Box my={4} display="flex" alignItems="center">
        <Select
          value={newInstance.courseId}
          onChange={(e) => setNewInstance({...newInstance, courseId: e.target.value})}
          displayEmpty
          fullWidth
          style={{ marginRight: '10px' }}
        >
          <MenuItem value="" disabled>Select course</MenuItem>
          {courses.map((course) => (
            <MenuItem key={course.id} value={course.id}>{course.title}</MenuItem>
          ))}
        </Select>
        <TextField
          label="Year"
          value={newInstance.year}
          onChange={(e) => setNewInstance({...newInstance, year: e.target.value})}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Semester"
          value={newInstance.semester}
          onChange={(e) => setNewInstance({...newInstance, semester: e.target.value})}
          style={{ marginRight: '10px' }}
        />
        <Button variant="contained" color="primary" onClick={addInstance}>
          Add instance
        </Button>
      </Box>

      <Box my={4}>
        <Button variant="contained" color="primary" onClick={fetchCourses}>
          List courses
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Title</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>
                    <SearchIcon />
                    <DeleteIcon onClick={() => deleteCourse(course.id)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box my={4} display="flex" alignItems="center">
        <TextField
          label="Year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <Select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          displayEmpty
          fullWidth
          style={{ marginRight: '10px' }}
        >
          <MenuItem value="" disabled>Select semester</MenuItem>
          <MenuItem value="1">Semester 1</MenuItem>
          <MenuItem value="2">Semester 2</MenuItem>
        </Select>
        <Button variant="contained" color="primary" onClick={() => fetchInstances(selectedYear, selectedSemester)}>
          List instances
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course Title</TableCell>
              <TableCell>Year-Sem</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instances.map((instance) => (
              <TableRow key={instance.id}>
                <TableCell>{instance.course.title}</TableCell>
                <TableCell>{`${instance.year}-${instance.semester}`}</TableCell>
                <TableCell>{instance.course.code}</TableCell>
                <TableCell>
                  <SearchIcon />
                  <DeleteIcon onClick={() => deleteInstance(instance.year, instance.semester, instance.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default App;