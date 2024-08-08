import { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea' 
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
const createServer = 'http://localhost:8080/create'

export const Create = () => {
  const toast = useRef(null);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const navigate = useNavigate();

 

  const show = (message) => {
      toast.current.show({ severity: 'info', summary: 'Info', detail: message });
  };

  const onClickCreate = async (e) => {
    await fetch(createServer, {
      method: 'POST',
      credentials: "include", 
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item_name: itemName,
        description: description,
        quantity: quantity
      })
    }).then(res => res.json())
      .then(res => {
        show(res.message)
        if (res.message === "Item created"){
          setTimeout(function(){
            navigate('/personal');
          }, 1000);  
        }
        if (res.message === "Unauthorized"){
          setTimeout(function(){
            navigate('/');
          }, 1000);
        }
      })
      .catch(err => console.log(err))
  }


  return (
    <>
    <Toast ref={toast} />
    <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))' }}>
        <div className="inline-flex flex-column gap-2">
            <label htmlFor="itemname" className="text-primary-50 font-semibold">
                Item Name
            </label>
            <InputText id="itemname" label="ItemName" className="bg-white-alpha-20 border-none p-3 text-primary-50" onChange={(e)=>setItemName(e.target.value)} keyfilter="alphanum" maxLength="50"></InputText>
        </div>
        <div className="inline-flex flex-column gap-2">
            <label htmlFor="description" className="text-primary-50 font-semibold">
                Description
            </label>
            <InputTextarea id="description" label="Description" className="bg-white-alpha-20 border-none p-3 text-primary-50" onChange={(e)=>setDescription(e.target.value)} keyfilter="alphanum" rows={5} cols={30} maxLength="500" autoResize></InputTextarea>
        </div>
        <div className="inline-flex flex-column gap-2">
            <label htmlFor="quantity" className="text-primary-50 font-semibold">
                Quantity
            </label>
            <InputText id="quantity" label="Quantity" className="bg-white-alpha-20 border-none p-3 text-primary-50" onChange={(e)=>setQuantity(e.target.value)} keyfilter="pint" maxLength="10"></InputText>
        </div>
        <div className="flex align-items-center gap-2">
            <Button label="Add Item" 
              onClick={(e) => {
                onClickCreate(e);
              }} 
              text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
            <Button label="Cancel" onClick={(e) => navigate('/')} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
        </div>
    </div>
    </>
  )
}