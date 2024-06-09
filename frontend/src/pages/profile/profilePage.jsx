import React from 'react'
import Profile from '../../layouts/page/profile'

const ProfilePage = () => {

  return (
    <section className='w-full max-w-[450px] lg:max-w-full md:max-w-[550px] min-h-[95vh] py-5 mx-auto my-5 px-4 border border-white-gray rounded-[25px] lg:overflow-y-scroll scrollbar-thin'>
      <Profile />
    </section>
  )
}

export default ProfilePage