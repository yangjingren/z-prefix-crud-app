import { useEffect, useState } from "react";
import { Card } from 'primereact/card';
import './Inventory.css';

const CHAR_LIMIT = 100;

const inventoryServer = 'http://localhost:8080/inventory'

export default function PersonalInventory(){
  const [fullInventory, setFullInventory] = useState([]);

  useEffect(() => {
    fetch(inventoryServer,{
      credentials: 'include',
      method: 'GET'
    })
      .then(res => res.json())
      .then(res => {
        if (res.length > 0){
          setFullInventory(res)
        }
        console.log(res)
      })
  },[])

  return (
    <div>
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
        ):(<>No items found
        </>)}
    </div>
  );
}