import React from 'react'

const Linkify = (text) => {
    const urlPattern =
      /((?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9()]{2,}(?:\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]*)?)/gi;
  
    return text.split(urlPattern).map((part, index) => {
      if (part.match(urlPattern)) {
        const href = part.match(/^https?:\/\//i) ? part : `http://${part}`;
        return (
          <a
            key={index}
            href={href}
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

export default Linkify