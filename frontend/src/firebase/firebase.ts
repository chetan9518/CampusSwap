import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"

const config ={
 apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  appId: import.meta.env.VITE_appId,
}
const App = initializeApp(config);
const Auth = getAuth(App);

export default Auth;
