import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Field, withFormik } from "formik";
import * as Yup from "yup";

import data from '../data';

import './Form.css';

const UserForm = ({ errors, touched, values, status }) => {
  const [users, setUsers] = useState([]);
  console.log("this is touched", touched);
  useEffect(() => {
    if (status) {
      setUsers([...users, status]);
    }
  }, [status]);

  return (
    <div className="user-form">
      <h1>User Onboarding</h1>
      <Form>
        <Field type="text" name="name" placeholder="Name" />
        {touched.name && errors.name && (
          <p className="error">{errors.name}</p>)}
        <Field type="text" name="email" placeholder="E-mail" />
        {touched.email && errors.email && <p className="error">{errors.email}</p>}
        <Field type="password" name="password" placeholder="Password" />
        {touched.password && errors.password && <p className="error">{errors.password}</p>}
        <label className="checkbox-container">
          Accept Terms of Service
          <Field
            type="checkbox"
            name="tos"
            checked={values.tos}
          />
          <span className="checkmark" />
          {touched.tos && errors.tos && <p className="error">{errors.tos}</p>}
        </label>
        <button type="submit">Submit!</button>
      </Form>

      {users.map(user => (
        <ol key={user.id}>
          <h2>Name: {user.name}</h2>
          <li>E-mail: {user.email}</li>
          <li>Password: {user.password}</li>
        </ol>
      ))}
    </div>
  );
};

const FormikUserForm = withFormik({
  mapPropsToValues({ name, email, password, tos }) {
    return {
      name: name || "",
      email: email || "",
      password: password || "",
      tos: tos || false,
    };
  },

  validationSchema: Yup.object().shape({
    name: Yup.string().required("Please enter your name."),
    email: Yup.string().email().required("Please enter your email."),
    password: Yup.string().min(8).required("Please enter your password."),
    tos: Yup.boolean().oneOf([true], "Please agree to the Terms of Service.")
  }),

  handleSubmit(values, { setStatus }) {
    axios
      .post("https://reqres.in/api/users", values)
      .then(res => {
        setStatus(res.data);
      })
      .catch(err => console.log(err.response));
  }
})(UserForm); 

export default FormikUserForm;

