import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useState, useRef, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { useContext } from 'react';
import { AuthContext } from './App';
import { useNavigate } from 'react-router-dom';


const loginServer = 'http://localhost:8080/verify'
const registerServer = 'http://localhost:8080/register'
const logoutServer = 'http://localhost:8080/logout'
const statusServer = 'http://localhost:8080/status'

export const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [visibleReg, setVisibleReg] = useState(false);
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const {authStatus, setAuthStatus} = useContext(AuthContext);

  const navigate = useNavigate();

  const toast = useRef(null);

  const show = (message) => {
      toast.current.show({ severity: 'info', summary: 'Info', detail: message });
  };

  //checks if auth token present
  useEffect(() => {
    fetch(statusServer, {
      method: 'POST',
      credentials: "include", 
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      }
    }).then(res => res.json())
      .then(res => {
        show(res.message)
        if(res.message==="Authenticated"){
          setAuthStatus(true);
        } 
      })
      .catch(err => console.log(err))
  }, [])
  
  const onClickLogin = async (e, hide) => {
    await fetch(loginServer, {
      method: 'POST',
      credentials: "include", 
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    }).then(res => res.json())
      .then(res => {
        show(res.message)
        if(res.message==="Authenticated"){
          setAuthStatus(true);
          hide(e);
          navigate('/personal')
        }
      })
      .catch(err => console.log(err))
  }

  const onClickRegister = async (e, hide) => {
    await fetch(registerServer, {
      method: 'POST',
      credentials: "include", 
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        username: newUsername,
        password: newPassword
      })
    }).then(res => res.json())
      .then(res => {
        console.log(res.message)
        setAuthStatus(true);
        hide(e);
        navigate('/personal')
      })
      .catch(err => console.log(err))
  }

  const onClickLogout = async () => {
    await fetch(logoutServer, {
      method: 'POST',
      credentials: "include", 
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      }
    }).then(res => res.json())
      .then(res => {
        setAuthStatus(false);
        navigate('/')
      })
      .catch(err => console.log(err))
       
  }

  return (
    <div>
        <div className=" flex justify-content-center gap-2 my-2">
        <Toast ref={toast} />
            {authStatus ? (<>
              <Button label="Logout" icon="pi pi-sign-out" onClick={() => onClickLogout()} />
              <Button label="Create Item" icon="pi pi-plus" onClick={() => navigate('/create')} />
              <Button label="Personal Inventory"  onClick={() => navigate('/personal')} />
              
                </>
              ): (
                <>
                <Button label="Login" icon="pi pi-user" onClick={() => setVisible(true)} />
            <Dialog
                visible={visible}
                modal
                onHide={() => {if (!visible) return; setVisible(false); }}
                content={({ hide }) => (
                    <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))' }}>
                        <div className="inline-flex flex-column gap-2">
                            <label htmlFor="username" className="text-primary-50 font-semibold">
                                Username
                            </label>
                            <InputText id="username" label="Username" className="bg-white-alpha-20 border-none p-3 text-primary-50" onChange={(e)=>setUsername(e.target.value)}></InputText>
                        </div>
                        <div className="inline-flex flex-column gap-2">
                            <label htmlFor="password" className="text-primary-50 font-semibold">
                                Password
                            </label>
                            <InputText id="password" label="Password" className="bg-white-alpha-20 border-none p-3 text-primary-50" type="password" onChange={(e)=>setPassword(e.target.value)}></InputText>
                        </div>
                        <div className="flex align-items-center gap-2">
                            <Button label="Sign-In" 
                              onClick={(e) => {
                                onClickLogin(e, hide);
                              }} 
                              text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                            <Button label="Cancel" onClick={(e) => hide(e)} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                        </div>
                    </div>
                )}
            ></Dialog>
            <Button label="Register" icon="pi pi-user" onClick={() => setVisibleReg(true)} />
            <Dialog
                visible={visibleReg}
                modal
                onHide={() => {if (!visibleReg) return; setVisibleReg(false); }}
                content={({ hide }) => (
                    <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))' }}>
                        <div className="inline-flex flex-column gap-2">
                            <label htmlFor="first_name" className="text-primary-50 font-semibold">
                                First Name
                            </label>
                            <InputText id="first_name" label="First_name" className="bg-white-alpha-20 border-none p-3 text-primary-50" onChange={(e)=>setFirstName(e.target.value)}></InputText>
                        </div>
                        <div className="inline-flex flex-column gap-2">
                            <label htmlFor="last_name" className="text-primary-50 font-semibold">
                                Last Name
                            </label>
                            <InputText id="last_name" label="Last_name" className="bg-white-alpha-20 border-none p-3 text-primary-50" onChange={(e)=>setLastName(e.target.value)}></InputText>
                        </div>
                        <div className="inline-flex flex-column gap-2">
                            <label htmlFor="username" className="text-primary-50 font-semibold">
                                Username
                            </label>
                            <InputText id="username" label="Username" className="bg-white-alpha-20 border-none p-3 text-primary-50" onChange={(e)=>setNewUsername(e.target.value)}></InputText>
                        </div>
                        <div className="inline-flex flex-column gap-2">
                            <label htmlFor="password" className="text-primary-50 font-semibold">
                                Password
                            </label>
                            <InputText id="password" label="Password" className="bg-white-alpha-20 border-none p-3 text-primary-50" type="password" onChange={(e)=>setNewPassword(e.target.value)}></InputText>
                        </div>
                        <div className="flex align-items-center gap-2">
                            <Button label="Sign-In" 
                              onClick={(e) => {
                                onClickRegister(e, hide);
                              }}  
                              text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                            <Button label="Cancel" onClick={(e) => hide(e)} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                        </div>
                    </div>
                )}
            ></Dialog> </>
              )}
            <Button label="All Items"  onClick={() => navigate('/')} />
        </div>
    </div>
  );
}

