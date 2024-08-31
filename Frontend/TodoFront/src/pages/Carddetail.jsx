import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosinst from '../components/axioswork';

function Carddetail({ closeModal, get, ty, onEdit, info }) {
  const [title, settitle] = useState(ty==='e'?info.title:' ');
  const [content, setcontent] = useState(ty==='e'?info.content:' ');
  const [error, seterror] = useState('');



  const edittodo = async (newdone) => {
    try {
      console.log(info);

      const res = await axiosinst.put('/edittodo/' + onEdit, {
        title: title,
        content: content,
        done: newdone,//ty==='e'?false:newdone
      })
      await get();
    } catch (error) {

    }
  };

  const addtodo = async () => {
    console.log("insidetodo-------");

    try {
      const res = await axiosinst.post('/addtodo', {
        title: title,
        content: content
      })
      console.log('inside addtodo', res);
      await get();
    } catch (error) {

    }
  };


  const handel = (e) => {
    e.preventDefault();
    if (!title || title.length == 1) {
      seterror('Please Enter Title')
      return
    } if (title.length > 30) {
      seterror('Tile is to long!')
      return
    }
    if (!content || content.length == 1) {
      seterror('Please Enter Content')
      return
    }
    if (content.length > 30) {
      seterror('Content is to Long!')
      return
    }
    if (ty === 'edit') {
      addtodo()

    } else { edittodo(false) }
    
    closeModal();

  }
  const cloa = () => {
    settitle('')
    setcontent('')
    seterror('')
    closeModal();
  } 

  return (
    <div className='flex flex-col justify-center relative'>
      <button onClick={cloa} className='w-7 h-7 rounded-full flex items-center justify-center absolute -top-3 -right-3 bg-gray-300 hover:bg-gray-500'>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
      </button>

      <div className=' flex flex-col gap-2'>
        <label className='input-label'>Title</label>
        <input type="text" value={title} onChange={(e) => settitle(e.target.value)}
          className=' text-slate-950 outline-none rounded-md '
          placeholder='Title' />
      </div>

      <div className=' flex flex-col gap-2'>
        <label className='input-label'>Content</label>
        <textarea type="text" value={content} onChange={(e) => setcontent(e.target.value)}
          className=' text-slate-950 outline-none rounded-md overflow-y-scroll h-28'
          placeholder='Content' />
      </div>
      {error && (<p className='text-red-600'>{error}</p>)}
      <button className='bg-blue-600 font-medium mt-5 p-3 rounded-md hover:bg-blue-500' onClick={handel}>
        {ty == 'edit' ? <div>Add</div> : <div>Save</div>}
      </button>
    </div>
  )
}

export default Carddetail
