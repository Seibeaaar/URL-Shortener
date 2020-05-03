import React, { useState, useEffect, useContext } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { AuthContext } from '../context/AuthContext';

const AuthPage = () => {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const { loading, error, request, clearError } = useHttp();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError])

  useEffect(() => {
    window.M.updateTextFields();
  }, [])

  const changeHandler = e => {
    setForm({...form, [e.target.name] : e.target.value})
  }

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', {...form});
      message(data.message);
    } catch(e) {}
  }

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', {...form});
      auth.login(data.token, data.userId);
    } catch(e) {}
  }


  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>Shorten your URL</h1>
        <div className="card blue darken-1">
          <div className="card-content white-text">
            <span className="card-title">Authorization</span>
            <div>
              <div className="input-field">
                <input 
                  placeholder="Enter your email" 
                  id="email" name="email" 
                  type="text" 
                  className="yellow-input"
                  value={form.email}
                  onChange={changeHandler}/>
                <label htmlFor="email">Email</label>
              </div>
              <div className="input-field">
                <input 
                  placeholder="Enter your password" 
                  id="password" 
                  name="password" 
                  type="password" 
                  className="yellow-input"
                  value = {form.password}
                  onChange={changeHandler} />
                <label htmlFor="password">Password</label>
              </div>
            </div>
          </div>
          <div className="card-action">
            <button onClick={loginHandler} disabled={loading} className="btn yellow darken-4" style={{marginRight: '10px'}}>Sign in</button>
            <button onClick={registerHandler} disabled={loading} className="btn grey lighten-1 black-text">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage;