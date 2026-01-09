import { GoogleAuthProvider,signOut,signInWithPopup, signInWithEmailAndPassword} from "firebase/auth";
import Auth from "./firebase";

const provider = new GoogleAuthProvider();

export const googleLogin= ()=>{
    return signInWithPopup(Auth,provider)
}
export const emailLogin=(email: string, password: string)=>{
    return signInWithEmailAndPassword(Auth, email, password)
}
export const signout = ()=>{
    return signOut(Auth);
}