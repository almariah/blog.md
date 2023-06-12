import '../styles/_posts.scss'
import Markdown from "markdown-to-jsx"
import {Link} from "react-router-dom";

import { useState, useEffect } from "react"
import { fetchPostsByDate } from '../posts';


export const createLink = (title, link, props) => {

  if (link == "/index.md" || link == "/") {
    return (
      <Link {...props} to="/"><Markdown>{title}</Markdown></Link>
    )
  }

  if (link.startsWith("/posts/")) {
    link = link.replace(/\.md$/, "")
    return (
      <Link {...props} to={link}><Markdown>{title}</Markdown></Link>
    )
  }

  return (
    <a {...props} href={link}><Markdown>{title}</Markdown></a>
  )
}

const Posts = ({tags, selectedTags, handleTags, heading, locale, dir}) => {

  const [posts, setPosts] = useState({})

  useEffect(() => {
    fetchPostsByDate([...tags, ...selectedTags], locale).then(x => setPosts(x))
  }, [selectedTags])

  return (
    <div className="posts">
      <h1>{heading}</h1>
      {Object.keys(posts).reverse().map((year) => {
        return (
          <div className="row">

            <div className="col-md-2 col-sm-12 padding-0 year">
              <h2>{year}</h2>
            </div>

            <div className="col-md-10 padding-0">
              {posts[year].map((post) => {
                return (
                  <div>
                    <div className='row'>
                      <div className='col-2 padding-0 date'>
                        <div>{post.date}</div>
                      </div>
                      <div className='col padding-0'>
                        <h3>{createLink(post.title, post.link, {})}</h3>

                        {post.tags.map((tag) => {
                          if (!tags.includes(tag))
                            return <button dir={dir} className={`bg-tag ${selectedTags.includes(tag) ? "bg-selected-1" : ""}`} onClick={ () => {
                              handleTags(tag)
                            }}
                            >{tag}</button>
                        })}
                        <p><Markdown>{post.summary}</Markdown></p>
                      </div>
                    </div>
                  </div>
                ) 
              })} 
            </div>

          </div>
        );
      })}
    </div>
  )
};

export default Posts 
