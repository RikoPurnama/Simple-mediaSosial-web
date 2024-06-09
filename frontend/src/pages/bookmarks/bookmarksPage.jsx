import React, { useState } from 'react'
import Posts from '../../fragments/cardPost/posts'

const BookmarksPage = () => {
    const [feedType, setFeedType] = useState("bookmarks")

  return (
    <div className="w-full max-w-[500px] lg:max-w-full md:max-w-[550px] py-5 mx-auto my-5 px-4 border border-white-gray rounded-[25px] overflow-y-hidden overflow-x-hidden bg-white">
        <div className="flex justify-between items-center py-4">
          <p className="font-bold text-2xl">Bookmarks</p>
        </div>

        <div className="w-full overflow-y-scroll overflow-x-hidden scrollbar-thin max-h-[95vh] pb-[200px]">
          <Posts feedType={feedType} />
        </div>
      </div>
  )
}

export default BookmarksPage