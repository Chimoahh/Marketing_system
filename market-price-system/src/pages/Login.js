import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Login() {
  const [isLogin, setIsLogin] = useState(true); // toggle login/register
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
  });

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      return showAlert('warning', 'Validation Error', 'Please fill in all required fields.');
    }

    try {
      const response = await fetch('http://localhost:8090/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      const data = await response.text();

      if (response.ok) {
        const role = data.toLowerCase().includes('admin') ? 'ADMIN' : 'CUSTOMER';
        showAlert('success', 'Login Successful', data);

        if (role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/products'); // or use "/home" based on your design
        }
      } else {
        showAlert('error', 'Login Failed', data);
      }
    } catch (err) {
      showAlert('error', 'Server Error', 'Server not reachable');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, firstName, lastName, email, password, phone } = registerForm;

    if (!username || !firstName || !lastName || !email || !password || !phone) {
      return showAlert('warning', 'Validation Error', 'Please fill in all required fields.');
    }

    try {
      const response = await fetch('http://localhost:8090/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm),
      });

      const data = await response.text();

      if (response.ok) {
        showAlert('success', 'Registration Successful', data);
        setIsLogin(true); // Switch to login after successful registration
      } else {
        showAlert('error', 'Registration Failed', data);
      }
    } catch (err) {
      showAlert('error', 'Server Error', 'Server not reachable');
    }
  };

  const showAlert = (icon, title, text) => {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: '#1e88e5',
      background: '#f4faff',
    });
  };

  return (
    <div style={container}>
      <form onSubmit={isLogin ? handleLogin : handleRegister} style={formStyle}>
        <h2 style={{ color: '#1e88e5', marginBottom: 16 }}>{isLogin ? 'Login' : 'Register'}</h2>

        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Username"
              value={registerForm.username}
              onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="First Name"
              value={registerForm.firstName}
              onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={registerForm.lastName}
              onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Phone"
              value={registerForm.phone}
              onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
              style={inputStyle}
            />

          </>
        )}

        <input
          type="email"
          placeholder="Email"
          value={isLogin ? loginForm.email : registerForm.email}
          onChange={(e) =>
            isLogin
              ? setLoginForm({ ...loginForm, email: e.target.value })
              : setRegisterForm({ ...registerForm, email: e.target.value })
          }
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={isLogin ? loginForm.password : registerForm.password}
          onChange={(e) =>
            isLogin
              ? setLoginForm({ ...loginForm, password: e.target.value })
              : setRegisterForm({ ...registerForm, password: e.target.value })
          }
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          {isLogin ? 'Login' : 'Register'}
        </button>

        <p style={{ marginTop: 10 }}>
          {isLogin ? 'No account?' : 'Already registered?'}{' '}
          <span onClick={() => setIsLogin(!isLogin)} style={toggleStyle}>
            {isLogin ? 'Register here' : 'Login here'}
          </span>
        </p>
      </form>
    </div>
  );
}

// Styling
const container = {
  height: '100vh',
  background: '#f4f4f4',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const formStyle = {
  background: '#fff',
  padding: 30,
  borderRadius: 8,
  width: 300,
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
};

const inputStyle = {
  padding: 10,
  marginBottom: 15,
  border: '1px solid #ccc',
  borderRadius: 4,
};

const buttonStyle = {
  padding: 10,
  backgroundColor: '#1e88e5',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
};

const toggleStyle = {
  color: '#1e88e5',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default Login;
