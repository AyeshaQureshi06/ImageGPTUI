import Login from '@/Components/Login'
import { getServerSession } from 'next-auth';
import React from 'react'

const page = () => {
    const session = getServerSession();
    if(session?.user?.email){
        redirect("/")
        // router.replace("/chat")
      }
  return (
    <div>
      <Login/>
    </div>
  )
}

export default page
