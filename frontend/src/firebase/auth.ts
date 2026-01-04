import { GoogleAuthProvider,signOut,signInWithPopup, EmailAuthProvider} from "firebase/auth";
import Auth from "./firebase";

const provider = new GoogleAuthProvider();
const emailProvider = new EmailAuthProvider();
export const googleLogin= ()=>{
    return signInWithPopup(Auth,provider)
}
export const emailLogin=()=>{
    return signInWithPopup(Auth,emailProvider)
}
export const signout = ()=>{
    return signOut(Auth);
}