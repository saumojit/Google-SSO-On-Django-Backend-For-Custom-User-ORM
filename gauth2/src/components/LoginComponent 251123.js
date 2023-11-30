import axios from 'axios'
import { useEffect, useState } from 'react'
import {Form , Button , Container } from 'react-bootstrap'
import { GoogleLogin , useGoogleLogin } from '@react-oauth/google';
// import { GoogleOAuthProvider } from '@react-oauth/google';  // It is wrapped on App.js



export const LoginComponent = () => {
    const [email , setEmail]=useState('')
    const [password , setPassword]=useState('')
    const [loginFlag , setLoginFlag]=useState(false)
    // eslint-disable-next-line
    const [providerToken , setProviderToken]=useState('')
    const [providerToken2 , setProviderToken2]=useState('')


    const submitHandler=async(e)=>{
        e.preventDefault()
        console.log(email , ' : ', password)
        const config = {
            headers :{
                'Content-type' : 'application/json' , 
            }
        }
        const { data }=await axios.post(
            'http://127.0.0.1:8000/auth/token' ,
            {
                'username' : email , 
                'password': password,
                'grant_type':   'password' , 
                'client_id' : '11' ,
                'client_secret' : '11'
            },
            config
            )
        localStorage.setItem('userInfo' , JSON.stringify(data))
        setLoginFlag(true)
    }


    const convertTokenHandler=async(credentialResponse)=>{
        // e.preventDefault()
        console.log('social_submitHandler')
        console.log("credentialResponse : " , credentialResponse)
        setProviderToken(credentialResponse["credential"])
        setLoginFlag(true)
        const config = {
            headers :{
                'Content-type' : 'application/json'
            }
        }
        const { data }=await axios.post(
            'http://localhost:8000/auth/convert-token' ,
            {
                'grant_type' : 'convert_token' , 
                'client_id': '11' ,
                'client_secret':  '11' ,
                'backend' : 'google-oauth2',
                'token' : credentialResponse["credential"] ,
            },
            config
            )
        console.log('data from django on token conversionn : ' , data)
        // localStorage.setItem('userInfo' , JSON.stringify(data))
        // setLoginFlag(true)
    }

    // working version with backend-flask
    const login = useGoogleLogin({
        onSuccess: tokenResponse => {
            console.log("tokenResponse : " , tokenResponse)
            setProviderToken2(tokenResponse)
            setLoginFlag(true)
        } ,
        // flow: 'auth-code' ,
    })
    
    const posth=async()=>{
        const config = {
            headers :{
                'Content-type' : 'application/json' , 
            }
        }
        const { data }=await axios.post(
            'http://127.0.0.1:8080/jwttoken' ,
            {
                'google_access_token' : providerToken2
            },
            config
            )
        console.log('from backend user details ' , data)
        // localStorage.setItem('userInfo' , JSON.stringify(data))
        // setLoginFlag(true)
    }

    useEffect(()=>{
        if(providerToken2!==''){
            posth()
        }
        // eslint-disable-next-line
    },[providerToken2])
    


    return (
        <Container>
            <h1>Login Window</h1>

            {/* Normal User - Password Authentication With JWT */}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='email' className='my-3'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control 
                        type="email" placeholder='Enter Email' value={email} onChange={(e)=>setEmail(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId='password' className='my-3'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" placeholder='Enter Password' value={password} onChange={(e)=>setPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <Button type="submit" variant="primary">Sign In</Button>
            </Form>

            <br/>

            {/* Google's Own Login Button - Customization Not Possible - Bug is there */}
            {/* <GoogleLogin
                onSuccess={credentialResponse => convertTokenHandler(credentialResponse) }
                onError={() => {
                    console.log('Login Failed');
                }}
                useOneTap
            /> */}

            
            
            {/*
                <GoogleLogin
                onSuccess={credentialResponse => {
                    console.log("credentialResponse : " , credentialResponse)
                    setProviderToken(credentialResponse["credential"])
                    setLoginFlag(true)
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
            /> */}

            <br/>

            {/* Creating Custom Button with the useGoogleLogin hook */}
            {/*  */}
            Google Custom Button Using React Google OAuth and Flask  and then Generating JWT Token <br/>
            <Button variant="primary"  onClick={() => login()}>
                Sign in with Google 🚀{' '}
            </Button>

            {loginFlag && <h4>I am logged in</h4>}
        </Container>
        
    )
}