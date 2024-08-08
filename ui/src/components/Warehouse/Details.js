import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"

const detailsServer = "http://localhost:8080/details/"

export const Details = () => {
  const { id } = useParams();
  const [edit, setEdit] = useState(false);
  const [details, setDetails] = useState('');
  
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
        console.log(res)
      })
      .catch(err => console.log(err))
  }, [])

  return(
    <>Details Page</>
  )

}