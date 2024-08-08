import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../App/App";
import { Card } from 'primereact/card';
import './Inventory.css';

const CHAR_LIMIT = 100;

const inventoryServer = 'http://localhost:8080/inventory'

export default function Inventory(){
  const {authStatus, setAuthStatus} = useContext(AuthContext);
  const [fullInventory, setFullInventory] = useState([]);
  const [personalInventory, setPersonalInventory] = useState([]);

  useEffect(() => {
    fetch(inventoryServer)
      .then(res => res.json())
      .then(res => {
        setFullInventory(res)
        console.log(res)
      })
  },[])


  return (
    <div>
        <h3>Inventory</h3>
        {fullInventory.length > 0 ? (
          fullInventory.map((item) => {
            return (
              <div className="card" key={item.id}>
                <Card title={item.item_name}>
                  <p className="m-0">
                    Description: <br/ >
                    {item.description.length > 100 ? (
                      <>{item.description.substring(0, CHAR_LIMIT)}...</>
                    ) : (<>{item.description}</>)}
                  </p> <br />
                  <footer>Quantity: {item.quantity}</footer>
                </Card>
              </div>
            )
          })
        ):(<>Loading...
        </>)}
    </div>
  );
}