import { LoginComponent } from "./components/LoginComponent";
import { GoogleOAuthProvider } from '@react-oauth/google';
// import { GAuth } from "./components/GAuth";
// import { HashRouter as Router } from 'react-router-dom' 

function App() {
  return (
    <div className="App">
      <GoogleOAuthProvider clientId="591441105547-o6lea6iqn1103urebsbos8epnmmqtv2b.apps.googleusercontent.com">
        <LoginComponent/>
      </GoogleOAuthProvider>
      

      
      {/* Another Google Authentication Flow <br/>
        <Router>
          <GAuth/>
        </Router> */
      }
    </div>
  );
}

export default App;
