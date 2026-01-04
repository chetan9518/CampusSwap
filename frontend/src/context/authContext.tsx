import { createContext, useContext, useEffect, useState } from "react";
import {onAuthStateChanged, type User } from "firebase/auth";
import Auth from "../firebase/firebase";
interface AuthcontextType {
    user:User|null,
    loading :boolean
}

const Context = createContext<AuthcontextType>({user:null,loading:true});


export const AuthContext = ({children}:{children:React.ReactNode})=>{
    const [user,setuser]= useState<User|null>(null);
    const [loading,setloading]= useState(true);

    useEffect(()=>{
    const unsubscribe =  onAuthStateChanged(Auth,(currentState)=>{
            setuser(currentState);
            setloading(false);
     } )
    
    return ()=>unsubscribe();
}
,[])
return <Context.Provider value={{user,loading}}>
    {children}
</Context.Provider>
}
export const useAuth = ()=>useContext(Context);
