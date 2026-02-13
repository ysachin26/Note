import React from 'react'

export const Register = () => {
  return (

        <div className="flex items-center justify-center h-screen bg-gray-200 ">

            <div className=" flex flex-col  items-center justify-center h-[350px] w-[400px] rounded-md" style={  {backgroundColor: 'oklch(97% 0.001 106.424)'} }>
              <h2 className="flex flex-start mb-3">Registration Form
              </h2>
                <form action="">
                     <div className="bg-white rounded-sm w-60 h-10 mb-5">
                        <label className=""  htmlFor="full name"></label>
                        <input className="h-10 w-60 focus:outline-none border-2 rounded-md " placeholder="full name" type="text" />
                    </div>
                    <div className="bg-white rounded-sm w-60 h-10">
                        <label className=""  htmlFor="email"></label>
                        <input className="h-10 w-60 focus:outline-none border-2 rounded-md " placeholder="email" type="email" />
                    </div>
                    <div className="bg-white rounded-sm w-60 h-10 mt-5">
                        <label htmlFor="password"></label>
                        <input className="h-10 w-60 focus:outline-none border-2 rounded-md" type="password" placeholder="password" />
                    </div>
                    <div className="bg-white rounded-sm w-60 h-10 mt-5">
                        <button className=" bg-black h-10 w-60 focus:outline-none text-white"type="submit"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>

    )
}

 
