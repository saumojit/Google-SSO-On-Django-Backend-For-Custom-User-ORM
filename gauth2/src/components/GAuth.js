import React from "react";
import { Button  } from 'react-bootstrap'
import axios from 'axios'
// import {useNavigate} from "react-router-dom"

export const GAuth = () => {
    // const navigate=useNavigate()
    const submitHandler=async(e)=>{
        e.preventDefault()
        console.log('g-submitHandler')
        const config = {
            headers :{
                'Content-type' : 'application/json'
            }
        }
        const { data }=await axios.get(
            'http://localhost:8080/authorize' ,
            config
            )
        console.log(data)
        // navigate(data)
        console.log('end of g-submitHandler')
        window_for_response(data)
        
    }

    const window_for_response=(data)=>{
        window.open(data, '_blank').focus();
        console.log('s')
          // Add event listener
        window.addEventListener('message', receiveMessage);
    }

    const receiveMessage = (event) => {
        // Check the message content (you might want to define a specific message for JSON data)
        console.log('je;')
        console.log(event)
        if (event.data && event.data.type === 'JSON_DATA') {
            const jsonData = event.data.data;
            console.log('Received JSON data:', jsonData);
          // Handle the received JSON data as needed
        }
    };

    return (<div>
        <p>welcome to custom gauth </p>
        <Button onClick={submitHandler}>Sign In With Google</Button>
    </div>)
};
