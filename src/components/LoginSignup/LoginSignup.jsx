 
import { useState } from 'react'
import { NavLink } from 'react-router'
export const LoginSignup = () => {
const active = 'bg-violet-300 p-3 w-25 rounded-md'
const [isLogin, setIsLogin] = useState('Login')
    return (

        <div className="flex items-center justify-center h-screen bg-gray-200 ">

            <div className=" flex flex-col  items-center justify-center h-[350px] w-[400px] rounded-md" style={{ backgroundColor: 'oklch(97% 0.001 106.424)' }}>
               <div className='flex justify-evenly gap-10 mb-5'>
                 <button  className={isLogin === 'Login' ? active : ''} onClick={()=>setIsLogin('Login')} >Login</button>
                <button className={isLogin === 'Signup' ? active : ''} onClick={()=>setIsLogin('Signup')} >Signup</button>
               </div>
                <form action="">
                    {isLogin === 'Login' ? 
                    
                <>
                
                {isLogin==='Login' ? <div></div>: <div className="bg-white rounded-sm w-60 h-10 mb-5">
                        <label className="" htmlFor="full name"></label>
                        <input className="h-10 w-60 focus:outline-none border-2 rounded-md " placeholder="full name" type="text" />
                    </div> }
                
                    <div className="bg-white rounded-sm w-60 h-10">
                        <label className="" htmlFor="email"></label>
                        <input className="h-10 w-60 focus:outline-none border-2 rounded-md " placeholder="email" type="email" />
                    </div>
                    <div className="bg-white rounded-sm w-60 h-10 mt-5">
                        <label htmlFor="password"></label>
                        <input className="h-10 w-60 focus:outline-none border-2 rounded-md" type="password" placeholder="password" />
                    </div>
                    <div className="bg-white rounded-sm w-60 h-10 mt-5">
                        <button className=" bg-black h-10 w-60 focus:outline-none text-white" type="submit"
                        >
                            Login
                        </button>
                    </div>
                    </>:   <>
                
                <div className="bg-white rounded-sm w-60 h-10 mb-5">
                        <label className="" htmlFor="full name"></label>
                        <input className="h-10 w-60 focus:outline-none border-2 rounded-md " placeholder="full name" type="text" />
                    </div>
                    <div className="bg-white rounded-sm w-60 h-10">
                        <label className="" htmlFor="email"></label>
                        <input className="h-10 w-60 focus:outline-none border-2 rounded-md " placeholder="email" type="email" />
                    </div>
                    <div className="bg-white rounded-sm w-60 h-10 mt-5">
                        <label htmlFor="password"></label>
                        <input className="h-10 w-60 focus:outline-none border-2 rounded-md" type="password" placeholder="password" />
                    </div>
                    
                    <div className="bg-white rounded-sm w-60 h-10 mt-5">
                        <button className=" bg-black h-10 w-60 focus:outline-none text-white" type="submit"
                        >
                            Sign In
                        </button>
                    </div>
                    </>}
                    
                </form>
                {isLogin==='Login'  ? <> <div className='mt-3'>Forget Password ? <a href="">click here</a></div> 
            </>:<div className='mt-3' onClick={()=>setIsLogin('Login')}>
                   <a href="#">already have account ? Login Here</a> 
             </div> }
                
                
            </div>
        </div>

    )
}


