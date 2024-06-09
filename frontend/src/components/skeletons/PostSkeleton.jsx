import React from 'react'

const PostSkeleton = () => {
  return (
    <div className="w-full py-5 px-4 mb-2 border border-white-gray rounded-[25px] animate-pulse">
      <div
        className={`w-full flex gap-2 justify-between`}
      >
        <div className="flex gap-2 items-center">
          <div
            style={{ backgroundImage: `url()` }}
            className="w-[50px] h-[50px] bg-white-gray/50 bg-cover bg-center rounded-full"
          ></div>
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-medium leading-5 bg-white-gray/50 text-transparent rounded">Riko purnama</h1>
            <p className="text-sm text-gray hover:underline bg-white-gray/50 text-transparent rounded w-20 h-3">@e.rickooo</p>
          </div>
        </div>
      </div>
      <div className='w-full h-[300px] bg-white-gray/50 rounded mt-2' />
    </div>
  )
}

export default PostSkeleton