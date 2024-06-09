import React, { useState } from 'react'

import MainContent from '../../layouts/page/mainContent';

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");
  return (
    <main className="w-full max-w-[500px] lg:max-w-full md:max-w-[550px] min-h-[110vh] py-1 md:py-5 mx-auto bg-white lg:mb-36">
      <MainContent feedType={feedType} />
    </main>
  )
}

export default HomePage