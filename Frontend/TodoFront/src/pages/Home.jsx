import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Card from '../components/Card'
import Modal from 'react-modal'
import Carddetail from './Carddetail';
import axiosinst from '../components/axioswork';


function Home() {
  const [info, setinfo] = useState()
  const [count, setcount] = useState(1);
  const [len, setlen] = useState(1);
  const [todos, settodos] = useState([])
  const [openmodel, setopenmodel] = useState({
    isshow: false,
    type: "add",
    data: null,
  });

  const closeModal = () => {
    setopenmodel({
      isshow: false,
      type: "add",
      data: null,
    });
  };
  const handelP = () => {
    if (count < len) {
      setcount(prevCount => prevCount + 1)
    }
  }

  const handelM = () => {
    if (count > 1) {
      setcount(prevCount => prevCount - 1)
    }
  }

  const profile = async () => {
    try {
      const res = await axiosinst.get('/getuser')
      setinfo(res.data)

    } catch (error) {

    }
  };

  const gettodos = async () => {
    try {
      console.log('count->', count);

      const res = await axiosinst.get(`/usertodo?page=${count}`)
      settodos(res.data.todos)
      setlen(res.data.len)
    } catch (error) {

    }
  };


  const searchtodos = async (query) => {
    try {
      if (query.length >= 1) {
        const res = await axiosinst.get('/searchtodo', { params: { query }, })
        settodos(res.data.todos);
      }
      else { gettodos(); }
    } catch (error) {

    }
  };

  useEffect(() => {
    gettodos();
    profile();
  }, [count])

  return (
    <div className='d'>
      <Navbar info={info} searchval={searchtodos} get={gettodos} />
      <div className=' mx-auto '>
        <div className='grid grid-cols-3 gap-4 mt-8 card'>

          {todos.map((todo) => (
            <Card key={todo._id} title={todo.title} content={todo.content} completCheck={todo.done} onDelete={() => { }} onEdit={todo._id} get={gettodos} />
          ))}

        </div>
      </div>

      <div className='flex justify-between foot'>
        <div className='mt-5  rounded-md fot '>
          <ul className="pagination flex">
            <li className="page-item hover:cursor-pointer" onClick={handelM}>
              <a className="page-link" aria-label="Previous">
                <span aria-hidden="true" className=' text-xl h-5 w-5 pl-3 pr-3 bg-blue-600 hover:bg-blue-500 rounded-md'>&laquo;</span>
                <span className="sr-only"  >Previous</span>
              </a>
            </li>
            <li className="page-item text-xl h-7 w-7 pl-3 pr-5 "><h1 className="page-link">{count}</h1></li>

            <li className="page-item hover:cursor-pointer" onClick={handelP}>
              <a className="page-link" aria-label="Next">
                <span aria-hidden="true" className=' text-xl h-5 w-5 pl-3 pr-3 bg-blue-600 hover:bg-blue-500 rounded-md'>&raquo;</span>
                <span className="sr-only">Next</span>
              </a>
            </li>
          </ul>
        </div>
        <button className='w-16 h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-5xl text-white plus mr-5'
          onClick={() => {
            setopenmodel({
              isshow: true,
              type: 'edit',
              data: null
            });
          }}>
          +
        </button>
      </div>
      <Modal
        isOpen={openmodel.isshow}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)',
          },
        }}
        contentLabel=''
        className='w-80 h-80 rounded-xl bg-gray-400 mx-auto mt-14 p-5 '>
        <Carddetail closeModal={closeModal} get={gettodos} ty={openmodel.type} />
      </Modal>


    </div>
  )
}

export default Home
