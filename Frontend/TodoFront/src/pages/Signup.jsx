import React, { useState } from 'react'
import Navbar from './Navbar';
import { validemail } from '../components/Validemail';
import { useNavigate } from 'react-router-dom';
import axiosinst from '../components/axioswork';

function Signup() {
  const navigate=useNavigate();
  const [email,setemail]=useState('');
  const [password,setpassword]=useState('');
  const [error,seterror]=useState('');
  
  const handelsignup = async(e)=>{
    
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
        const response=await axiosinst.post('/signup',{
          email:email,
          password:password
        });
        console.log("signup=>",response);
        if (response.data.error) {
          seterror(response.data.message)
          return;
        }
        if (response.data && response.data.accestoken) {
          localStorage.setItem('token',response.data.accestoken);
          console.log("token-",localStorage.getItem('token'));
          
          navigate('/home');
        }
    
      } catch (error) {
        seterror('signup not working')
      }
      seterror('')
  }
  
    return (
      <div>
        <Navbar/>
        <div className='flex items-center justify-center mt-28'>
          <div className='w-96 border rounded bg-white px-7 py-10'>
            <form onSubmit={handelsignup}>
              <h4 className='text-2xl mb-5'>SignUp
                <input type="text" placeholder='Email' className='input-box mt-5' value={email} onChange={(e)=>setemail(e.target.value)}/>
                <input type="password" placeholder='Password' className='input-box' value={password} onChange={(e)=>setpassword(e.target.value)} />
                {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
                <button type='submit' className='btn-primary'>SignUp</button>
                <p className='text-sm text-center mt-4'>
                 Already have Accont{" "}
                  <a href="/login" className='text-cyan-500'>Login</a>
                </p>
              </h4>
            </form>
          </div>
        </div>
      </div>
  )
}

export default Signup
