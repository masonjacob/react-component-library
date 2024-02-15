import React , {useState} from 'react';
import google_logo from './../assets/google-logo.svg';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Login: React.FC = () => {
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const isEmailValid = (email: string): boolean => {
  // Simple email validation using a regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

  const handleLogin = async () => {
    try {
          if (!isEmailValid(email) || !password) {
            console.error('Please enter a valid email and password.');
            return;
          }

      // Send email and password to the backend
      const response = await axios.post('http://127.0.0.1:6868/auth/login', {
        email,
        password,
      });

      // Handle successful login
      console.log(response.data);
    } catch (error) {
      // Handle login error
      console.error('Login failed:', (error as Error).message);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      console.log(code)
      const tokens = await axios.post('http://127.0.0.1:6868/auth/google-login', {  // http://localhost:3001/auth/google backend that will exchange the code
        code,
      });
      console.log(tokens);
    },
    flow: 'auth-code',
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-pink-400">
      <div className="max-w-md w-full bg-white p-8 shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              type="text"
              id="email"
              className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="w-full rounded-md py-2 px-4 bg-gradient-to-r font-bold from-blue-500 to-pink-500 text-white hover:opacity-90 transition duration-300"
            onClick={handleLogin}
          >
            Login with Email/Password
          </button>
          <div className="text-center text-gray-500 my-2">or</div>
          <button
            type="button"
            className="w-full flex items-center justify-center border-2 border-red-500 bg-white text-red-500 font-bold rounded-md py-2 px-4 hover:bg-red-500 hover:text-white transition duration-300"
            onClick={handleGoogleLogin}
          >
            <img src={google_logo} alt="Google Logo" className="w-6 h-6 mr-2" />
            Login with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;