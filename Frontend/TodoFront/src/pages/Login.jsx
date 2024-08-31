import React, { useState } from 'react'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom'
import { validemail } from '../components/Validemail';
import  axiosinst  from '../components/axioswork'

function Login() {
const navigate=useNavigate();
const [email,setemail]=useState('');
const [password,setpassword]=useState('');
const [error,seterror]=useState('');

const handellogin = async(e)=>{
  e.preventDefault();
  if (!validemail(email)) {
    seterror('Please enter a valid email.');
    return;
  }
  if (!password) {
    seterror('Please Enter Password')
    return;
  }

  try {
    const response=await axiosinst.post('/login',{
      email:email,
      password:password
    });
    console.log(response);
    if (response.data.error) {
      seterror(response.data.message)
      return;
    }
    if (response.data && response.data.accestoken) {
      localStorage.setItem('token',response.data.accestoken);
      navigate('/home');
    }

  } catch (error) {
    seterror('login not working')
  }
  seterror('')
}


  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
          <form onSubmit={handellogin}>
            <h4 className='text-2xl mb-7'>Login
              <input type="text" placeholder='Email' className='input-box mt-5' value={email} onChange={(e)=>setemail(e.target.value)}/>
              <input type="password" placeholder='Password' className='input-box' value={password} onChange={(e)=>setpassword(e.target.value)} />
              {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
              <button type='submit' className='btn-primary'>Login</button>
              <p className='text-sm text-center mt-4'>
                Not registered yet?{" "}
                <a href="/signup" className='text-cyan-500'>Creat an Accont</a>
              </p>
            </h4>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login