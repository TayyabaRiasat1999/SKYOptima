import { createContext, useEffect, useState,useContext } from "react";
import { supabase } from "../supabaseClient.js";




const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  // Sign Up
  const signUpNewUser = async (email, password, username, dltUnid) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      
    });
    if (authError) return { success: false, error: authError.message };
    if (authData.user) {
    const { error: dbError } = await supabase
      .from('users') // Your table name
      .insert([
        { 
          id: authData.user.id,
          username: username,
          email: email,
          dlt_unid: dltUnid 
          
        }
      ]);

    if (dbError) {
      console.error("Database error:", dbError);
      return { success: false, error: "Auth worked, but database save failed." };
    }
  }

  return { success: true, data: authData };
  };

  // Sign In
  const signInUser = async (email, password) => {
    try{
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password})
        if (error){
          console.error('there is a problem signing in: ', error)
          return{success:false,error: error.message}
        }
        console.log("sign in success: ",data)
        return{success:true,data}
      

    } catch(error){
      console.error('there is a problem signing in: ', error)
    }
  }

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}}) => {
    setSession(session)
    
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    })
  },[]);

  // Sign Out

  const signOut = () => {
    const { error } = supabase.auth.signOut();
    if (error){
      console.error('there is a problem signing out: ', error)
    }
  }

  return(
    <AuthContext.Provider value={{ session,signUpNewUser,signInUser, signOut}}>
      {children}
    </AuthContext.Provider>
  )
}


 export const UserAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('UserAuth must be used within an AuthContextProvider');
  }
  return context;
}