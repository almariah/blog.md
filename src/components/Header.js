import '../styles/_header.scss'

import { BlogConfig } from '../App';
import React from 'react';

const Header = () => {
  const config = React.useContext(BlogConfig);
  return (
    <div className="masthead">
      <div className="banner">
        <h1><a href="/">{config?.title}</a></h1>
        <h2>{config?.subtitle}</h2>
      </div>
    </div>
  )
}

export default Header
