import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom"
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const detailsServer = "http://localhost:8080/details/"
const updateServer = "http://localhost:8080/update";
const deleteServer = "http://localhost:8080/delete";

export const Details = () => {
  const { id } = useParams();
  const [edit, setEdit] = useState(false);
  const [details, setDetails] = useState('');
  const [toggle, setToggle] = useState(true);

///////////////////////////
  const toast = useRef(null);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const navigate = useNavigate();

 

  const show = (message) => {
      toast.current.show({ severity: 'info', summary: 'Info', detail: message });
  };

  const onToggleEdit = async (e) => {
    setToggle(!toggle);
  }

  const onClickUpdate = async () => {
    fetch(updateServer, {
      method: 'PUT',
      credentials: "include", 
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item_id: id,
        item_name: itemName,
        description: description,
        quantity: quantity
      })
    }).then(res => res.json())
      .then(res => {
        show(res.message)
      })
      .catch(err => console.log(err))
  }

  const onClickDelete = async () => {
    fetch(deleteServer, {
      method: 'DELETE',
      credentials: "include", 
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item_id: id
      })
    }).then(res => res.json())
      .then(res => {
        if (res.message==="Item deleted"){
          show(res.message)
          setTimeout(function(){
            navigate('/personal');
          }, 1000); 
        } else {
          show(res.message)
        }
      })
      .catch(err => console.log(err))
  }
  
  useEffect(()=>{
    let url = detailsServer + id;
    fetch(url, {
      method: 'GET',
      credentials: "include", 
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      }
    }).then(res => res.json())
      .then(res => {
        setDetails(res)
        setItemName(res.item_name)
        setDescription(res.description)
        setQuantity(res.quantity)
        setEdit(res.edit)
      })
      .catch(err => console.log(err))
  }, [id])

  return(
    <><Toast ref={toast} />
    {details? (<>
      
    <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px' }}>
        <div className="inline-flex flex-column gap-2">
            <label htmlFor="itemname" className="font-semibold">
                Item Name
            </label>
            <InputText id="itemname" label="ItemName" className="p-3 text-black-alpha-80" onChange={(e)=>setItemName(e.target.value)} maxLength="50" value={itemName?itemName:''} disabled={toggle}></InputText>
        </div>
        <div className="inline-flex flex-column gap-2">
            <label htmlFor="description" className="font-semibold">
                Description
            </label>
            <InputTextarea id="description" label="Description" className="p-3 text-black-alpha-80" onChange={(e)=>setDescription(e.target.value)} rows={5} cols={30} maxLength="500" autoResize value={description?description:''} disabled={toggle}></InputTextarea>
        </div> 
        <div className="inline-flex flex-column gap-2">
            <label htmlFor="quantity" className="font-semibold">
                Quantity
            </label>
            <InputText id="quantity" label="Quantity" className="p-3 text-black-alpha-80" onChange={(e)=>setQuantity(e.target.value)} keyfilter="pint" maxLength="10" value={quantity?quantity:''} disabled={toggle}></InputText>
        </div>
        <div className="flex align-items-center gap-2">
          {edit ? (<> <Button label="Toggle Edit" 
              onClick={(e) => {
                onToggleEdit(e);
              }} 
              text className="p-3 w-full border-1 border-black-alpha-30 hover:bg-black-alpha-10"></Button>
            <Button label="Save" onClick={() => onClickUpdate()} text className="p-3 w-full border-1 border-black-alpha-30 hover:bg-black-alpha-10" visible={!toggle}></Button>
            <Button label="Delete" onClick={() => onClickDelete()} text className="p-3 w-full border-1 border-black-alpha-30 hover:bg-black-alpha-10" ></Button></>
            ):(<></>)}
           <Button label="Back" onClick={() => navigate(-1)} text className="p-3 w-full border-1 border-black-alpha-30 hover:bg-black-alpha-10" ></Button>
        </div>
    </div>
      </>
    ):(
      <>
      Loading...
      </>
    )}</>
  )

}