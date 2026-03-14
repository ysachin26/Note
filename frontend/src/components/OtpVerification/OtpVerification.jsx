import React from 'react'

const OtpVerification = () => {
    return (
        <div className='flex items-center justify-center h-screen bg-grey-200 '>

            <div className=' flex flex-col  items-center justify-center h-[350px] w-[400px]
             bg-[rgba(255,255,255,0.8)] rounded-md'>
                <h1>Check Your Inbox For Code</h1>
                <div className='flex flex-row '>
                    <input className='border h-[35px]  w-[40px]' type="text" />
                    <input className='border h-[35px]  w-[40px]' type="text" />
                    <input className='border h-[35px]  w-[40px]' type="text" />
                    <input className='border h-[35px] w-[40px]' type="text" />
                </div>
                <div>
                    Resend OTP
                </div>
            </div>


        </div>
    )
}

export default OtpVerification
