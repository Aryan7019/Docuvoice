"use client"

import React,{useContext, useEffect, useState} from 'react'
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from '@/context/UserDetailContext';

export type UsersDetail={
   name:string;
   email:string;
   credits:number;
   clerkID:string;
}

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

   const {user}= useUser();
   const [userDetail,setUserDetail] = useState<any>();

   useEffect(() => {
      user && CreateNewUser();
   }, [user]);

  const CreateNewUser = async() => {
      try {
        const result = await axios.post('/api/users');
        setUserDetail(result.data);
      } catch (error) {
        // Log user creation errors in development
        if (process.env.NODE_ENV === 'development') {
          console.error('User creation error:', error);
        }
      }
  }

  return (
    <div>
      <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
         {children}
      </UserDetailContext.Provider>
    </div>
  )
}
