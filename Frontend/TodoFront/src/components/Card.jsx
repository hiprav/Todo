import React, { useState } from 'react'
import Modal from 'react-modal'
import Carddetail from '../pages/Carddetail';
import axiosinst from './axioswork';
function Card({ title, content, completCheck, onDelete, onEdit ,get}) {

    const [toggle,settoggle]=useState(completCheck);
    const [openmodel,setopenmodel]=useState({
        isshow:false,
        type:"add",
        data:null,
      });
    
      const closeModal = () => {
        setopenmodel({
          isshow: false,
          type: "add",
          data: null,
        });
      };
   
      const edittodo=async(newToggle)=>{
        
        try {
          const res=await axiosinst.put('/edittodo/'+ onEdit,{
            title,
            content,
           done:newToggle
          })
          await get();
        } catch (error) {
          
        }
      };
    const todocomplete=()=>{
        const newToggle = event.target.checked;
  settoggle(newToggle);
  edittodo(newToggle);
          
    }
    const a=()=>{}
    const deletetodo=async()=>{
        console.log('deleting');
        
        try {
          const res=await axiosinst.delete('/deletetodo/'+ onEdit)
          await get();
        } catch (error) {
          console.log(error.message);
          
        }
      };
    return (
        <>
        <div className={toggle?'bg-slate-400 rounded-md w-96 m-3 p-2 cw':'bg-slate-500 rounded-md w-96 m-3 p-2 cw'}>
            <div className='flex justify-between items-center'>
                <div>
                    <h6 className={toggle?'ml-3 completed':'ml-3 '}>{title}</h6>
                </div>
                <input type="checkbox" className='m-1 h-6 w-6' checked={toggle} onChange={a} onClick={todocomplete} />
            </div>
            
            <div className='flex items-center justify-between mt-2 '>
            <p className='ml-3'>{content}</p>
                <div className='flex items-center gap-2'>
                    <span className="material-symbols-outlined hover:cursor-pointer " onClick={()=>{
        setopenmodel({
          isshow:true,
          type:'add',
          data:{title,content}
        });
      }}>edit_note</span>
                    <span className="material-symbols-outlined hover:cursor-pointer" onClick={deletetodo}>delete</span>
                </div>
            </div>
        </div>
        
      <Modal
      isOpen={openmodel.isshow}
      onRequestClose={()=>{}}
        style={{
          overlay:{
            backgroundColor:'rgba(0,0,0,0.2)',
          },
        }}
        contentLabel=''
        className='w-80 h-80 rounded-xl bg-gray-400 mx-auto mt-14 p-5 '>
          <Carddetail closeModal={closeModal} get={get} onEdit={onEdit} ty={'e'} info={{title,content}}/>
      </Modal>
      </>
    )
}

export default Card
