import React from 'react'

const CreateStory = () => {
  return (
    <div
        style={{ backgroundImage: "url(/profile.png)" }}
        className="w-14 h-14 rounded-full bg-white-gray flex justify-end items-end bg-cover cursor-pointer"
      >
        <div className="w-4 h-4 flex justify-center items-center bg-sky-500 rounded-full">
          <FaPlus className="text-sm  text-white rounded-full" />
        </div>
      </div>
  )
}

export default CreateStory