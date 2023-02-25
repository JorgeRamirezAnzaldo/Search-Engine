//Import React and useState
import React, { useState } from 'react';
//Import elements from react-bootstrap
import { Form, Button, Alert } from 'react-bootstrap';
//Import useMutation
import { useMutation } from '@apollo/client';
//Import LOGIN_USER mutation
import { LOGIN_USER } from '../utils/mutations';
//Import Auth class
import Auth from '../utils/auth';

//Function for LoginForm
const LoginForm = () => {
  //Set the initial state for the form
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  //Configure login to use the LOGIN_USER mutation
  const [login, { error, data }] = useMutation(LOGIN_USER);
  //Set other state variables
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  //Function to handle input changes in the form
  const handleInputChange = (event) => {
    const { name, value } = event.target; //Get name and value of the input field changes
    setUserFormData({ ...userFormData, [name]: value }); //Change state variable for using the form data
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // verifique si el formulario tiene todo (según los documentos de react-bootstrap)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    //Login process
    try {
      const { data } = await login({ //Login using the form data introduced
        variables: {...userFormData}
      })
      Auth.login(data.login.token); //Call the login method of the authorization class to save token to localStorage
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }
    //Clean the form data 
    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  //Return all necessary elements, functions and variables
  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

//Export LoginForm
export default LoginForm;
