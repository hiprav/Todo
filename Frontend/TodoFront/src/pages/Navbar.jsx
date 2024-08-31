import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'

function Navbar({ info, searchval, get }) {


    let name = info?.user.email.split('@').join(' ').split(' ')[0];
    const [showNavbar, setShowNavbar] = useState(true);
    const [search, setsearch] = useState('')

    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        navigate('/login')
    }
    const handelClose = () => {
        setsearch('')
        get()
    }
    const handelSearch = () => {
        searchval(search);

    }
    useEffect(() => {
        const path = location.pathname;
        if (path === '/login' || path === '/signup' || path === '/') {
            setShowNavbar(false);
        } else {
            setShowNavbar(true);
        }
    }, [location]);
    return (
        <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
            <h2 className=' text-xl font-medium text-black py-2 mr-1'>TODO</h2>

            {showNavbar?<div className='w-80 flex items-center px-4 bg-slate-100 rounded-md'>
                <input type="text" placeholder='Search' className='w-full text-xs bg-transparent py-[11px] outline-none' value={search} onChange={(e) => setsearch(e.target.value)} />
                {search && (<IoMdClose className='text-slate-400 cursor-pointer hover:text-black h-9 w-5 mr-2' onClick={handelClose} />)}
                <FaMagnifyingGlass className='text-slate-400 cursor-pointer hover:text-black h-9 w-5' onClick={handelSearch} />
            </div>:<div></div>}

            {showNavbar?<div className='flex items-center gap-3 '>
                <p className='text-sn font-medium hd'>{name}</p>
                <div className='w-12 h-12 flex font-bold text-xl items-center justify-center rounded-full text-slate-950 bg-slate-300 ml-1'>
                    {info?.user?.email.charAt(0).toUpperCase()}
                </div>

                <div>
                    <span className="material-symbols-outlined hover:cursor-pointer" onClick={logout}>logout</span>
                </div>
            </div>:<div></div>}
        </div>
    )
}

export default Navbar
