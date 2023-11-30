import axios from 'axios'
import React , {useState } from 'react'
import {Form , Button , Container } from 'react-bootstrap'
// import FacebookLogin from 'react-facebook-login'
import { LoginSocialFacebook } from 'reactjs-social-login'
import {FacebookLoginButton } from 'react-social-login-buttons'
// const REDIRECT_URI = 'http://localhost:3000/'


export const LoginComponent = () => {
    const [email , setEmail]=useState('')
    const [password , setPassword]=useState('')
    const [loginFlag , setLoginFlag]=useState(false)
    // const [facebookToken , setFacebookToken]=useState('')

    const submitHandler=async(e)=>{
        e.preventDefault()
        console.log(email , ' : ', password)


        const config = {
            headers :{
                'Content-type' : 'application/json'
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


    return (
        <Container>
            <h1>Login Window</h1>
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


            <LoginSocialFacebook
                appId='278016935154184'
                // fieldsProfile={
                //     'name'
                // }
                // onLoginStart={onLoginStart}
                // onLogoutSuccess={onLogoutSuccess}
                // redirect_uri={REDIRECT_URI}
                onResolve={({ response }) => {
                    // setFacebookToken(data)
                    console.log('facebooktoken : ',response)
                }}
                onReject={err => {
                    console.log(err);
                }}
                >
            <FacebookLoginButton />
            </LoginSocialFacebook>

            {loginFlag && <h4>I am logged in</h4>}
        </Container>
        
    )
}