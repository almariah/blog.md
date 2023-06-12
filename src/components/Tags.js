import '../styles/_tags.scss'
import Markdown from "markdown-to-jsx"
import {Link} from "react-router-dom";

import { useState, useEffect } from "react"
import { fetchTags } from '../posts';


const Tags = ({posts, selectedTags, handleTags, heading, dir}) => {

  const [tags, setTags] = useState([])

  useEffect(() => {
    fetchTags([...posts, ...selectedTags], posts).then(fetchedTags => setTags(fetchedTags))
  }, [selectedTags])

  return (
    <div className='tags'>
      <h1>{heading}</h1>
      {tags.map((tag) => {
        return  <button dir={dir} className={`badge bg-tags ${selectedTags.includes(tag) ? "bg-selected" : ""}`}
        onClick={()=> {
            handleTags(tag)
        }}
        >{tag}</button>
      })}
    </div>
  )
};

export default Tags 
