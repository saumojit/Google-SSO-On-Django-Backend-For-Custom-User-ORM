import axios from 'axios'
import { useEffect, useState } from 'react'
import { Button , Container } from 'react-bootstrap'
import { GoogleLogin , useGoogleLogin } from '@react-oauth/google';
// import { GoogleOAuthProvider } from '@react-oauth/google';  // It is wrapped on App.js



export const LoginComponent = () => {
    const [loginFlag , setLoginFlag]=useState(false)
    const [providerToken2 , setProviderToken2]=useState('')


    const generateGoogleTokenHandler1=async(credentialResponse)=>{
        console.log("from generateGoogleToken1 (Component Based) => credentialResponse  : " , credentialResponse)
    }

    // flow has become implicit by commenting flow : auth-code
    const generateGoogleTokenHandler2 = useGoogleLogin({
        onSuccess: tokenResponse => {
            console.log("from generateGoogleTokenHandler2 (Hook Based) => tokenResponse :  " , tokenResponse)
            setProviderToken2(tokenResponse)
            setLoginFlag(true)
        } ,
        // flow: 'auth-code' ,
    })

    const authBackendToken=async()=>{
        const config = {
            headers :{
                'Content-type' : 'application/json' , 
            }
        }
        const { data }=await axios.post(
            'http://127.0.0.1:8000/api/users/login/sso/' , // for django app
			// 'http://127.0.0.1:8080/jwttoken' , // for flask app
            {
                'google_access_token' : providerToken2
            },
            config
            )
        console.log('from backend user data ' , data)
        // localStorage.setItem('userInfo' , JSON.stringify(data))
        setLoginFlag(true)
    }

    useEffect(()=>{
        if(providerToken2!==''){
            authBackendToken()
        }
        // eslint-disable-next-line
    },[providerToken2])
    

    return (
        <Container>
            <h1>Google SSO Window</h1> <br/><br/>
            <b> 1.  Google's Own Login Button Developed GoogleLogin React Component </b> <br/>
            Customization Not Possible - Bug is there <br/>
            <br/>
            <GoogleLogin
                onSuccess={credentialResponse => generateGoogleTokenHandler1(credentialResponse) }
                onError={() => {
                    console.log('Login Failed');
                }}
                useOneTap
            />

            <br/><br/><br/>

            <b> 2.  Creating Custom Button with  useGoogleLogin Hook </b> <br/>
            Google Custom Button Using React and Flask , then Generating JWT Token with Google Access Token <br/>
            Flask/Django Backend : Generates JWT Token with User-Details which is recieved on exchanging Google Access Token Received From React <br/>
            <br/>
            <Button variant="primary"  onClick={() => generateGoogleTokenHandler2()}>
                Sign in with Google 🚀{' '}
            </Button>
            

            <br/><br/><br/>
            {loginFlag && <b>I am logged in to portal</b>}
        </Container>
        
    )
}