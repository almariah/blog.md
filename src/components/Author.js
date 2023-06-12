import '../styles/_author.scss'

import { BlogConfig } from '../App';
import React from 'react'

const Author = () => {
  const config = React.useContext(BlogConfig);
  return (
    <div className="author">
      <a href={config.author_link} title="about">
        <img className="author-img" src={config.author_image}></img>
        <div>{config.author}</div>
      </a>
    </div>
  )
}

export default Author
