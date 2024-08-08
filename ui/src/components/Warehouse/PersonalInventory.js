import { useEffect, useState } from "react";
import { Card } from 'primereact/card';
import './Inventory.css';
import { useNavigate } from "react-router-dom";

const CHAR_LIMIT = 100;

const inventoryServer = 'http://localhost:8080/inventory'

export default function PersonalInventory(){
  const [fullInventory, setFullInventory] = useState([]);
  const navigate = useNavigate();

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
      })
  },[])

  const onClickFunction = (id) => {
    navigate(`/item/${id}`);
  }

  return (
    <div>
        {fullInventory.length > 0 ? (
          fullInventory.map((item) => {
            return (
              <div className="card" key={item.id}>
                <Card title={item.item_name} onClick={() => onClickFunction(item.id)}>
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