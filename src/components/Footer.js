import '../styles/_footer.scss'

import { BlogConfig } from '../App';
import React from 'react';

const Footer = ({copyright}) => {
  const config = React.useContext(BlogConfig);
  return (
    <footer className='footer'>
      <p>{config.copyright}</p>
    </footer>
  )
}

export default Footer
