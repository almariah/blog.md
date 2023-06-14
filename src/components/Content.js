import { useState, useEffect } from "react"
import Markdown, { compiler } from "markdown-to-jsx"

import PreBlock from "./Code"
import Blockquote from "./Blockquote"

import { BlogConfig } from '../App';
import { fetchPosts, fetchPostsByDate, fetchTags } from '../posts';

import '../styles/_content.scss'

import React from 'react'
import OtherPosts from "./OtherPosts"
import Author from "./Author"
import MDLink from "./MDLink"
import Toc, {conformHeaderID} from "./Toc"

import Disqus from "disqus-react"


import {
  BrowserRouter as Router,
  useParams,
  Link,
  useLocation,
} from "react-router-dom";
import Posts, {createLink} from "./Posts"
import language from "react-syntax-highlighter/dist/esm/languages/hljs/1c";
import Tags from "./Tags";

const yaml = require('js-yaml');

const Content = () => {
  const config = React.useContext(BlogConfig);

  const { pathname, hash, key } = useLocation();

  const [postContent, setPostcontent] = useState('')
  const [postFrontmatter, setPostFrontmatter] = useState({})
  const [otherPosts, setOtherPosts] = useState([])
  const [fullScreen, setFullScreen] = useState(false)

  const [selectedTags, setSelectedTags] = useState([])

  const useFullScreen= () => {
    setFullScreen(!fullScreen)
  }

  const handleTags = (tag) => {
    if (selectedTags.includes(tag)) {
      const x = selectedTags.filter(function(item) { return item !== tag })
      setSelectedTags(x)
    } else {
      setSelectedTags(oldArray => [...oldArray, tag])
    }
  }

  const id = useParams()["*"]

  const headerIDMap = {}

  const disqusShortname = "worldismyidea-com"
    const disqusConfig = {
      url: window.location.href,
      //identifier: window.location.href,
      title: postFrontmatter.title,
      language: postFrontmatter.comments
    }

  const fetchContent = () => {
    setSelectedTags([])
    setPostFrontmatter({})
    let idPath = id
    if (idPath === undefined) {
      idPath = "/posts/index.md"
    } else {
      idPath = "/posts/" + idPath + ".md"
    }
    let yamlObject = {}
    fetch(idPath)
      .then(function(response){ 
        return response.text();
      })
      .then(function(data) {
        data = data.replace(/^[\r?\n]+/g, "")
        let regexConst = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/
        const matched  = data.match(regexConst);
        if (matched != null) {
          yamlObject = yaml.load(matched[1])
          if (!yamlObject.dir || yamlObject.dir != "rtl") {
            yamlObject.dir = "ltr"
          }
          setPostFrontmatter(yamlObject)

          if (yamlObject.other_posts) {
            fetchPosts(yamlObject.other_posts, window.location.pathname, yamlObject.other_posts_limit || 5).then(x => setOtherPosts(x))
          }
        }
        
        let trimmed = data.replace(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/g, "");
        trimmed = trimmed.replace(/^[\r?\n]+/g, "")
        setPostcontent(trimmed)
      });
  }

  useEffect(() => {
    fetchContent()
    if (hash === '') {
      window.scrollTo(0, 0);
    }
    else {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView();
        }
      }, 100);
    }

  }, [id])

  const slugifyID = (headerID) => {
    const sluggedID =  headerID
      .replace(/[ÀÁÂÃÄÅàáâãäåæÆ]/g, 'a')
      .replace(/[çÇ]/g, 'c')
      .replace(/[ðÐ]/g, 'd')
      .replace(/[ÈÉÊËéèêë]/g, 'e')
      .replace(/[ÏïÎîÍíÌì]/g, 'i')
      .replace(/[Ññ]/g, 'n')
      .replace(/[øØœŒÕõÔôÓóÒò]/g, 'o')
      .replace(/[ÜüÛûÚúÙù]/g, 'u')
      .replace(/[ŸÿÝý]/g, 'y')
      .replace(/[^a-z0-9- ]/gi, '') // cause issues with arabic
      .replace(/ /gi, '-')
      .toLowerCase();
    return conformHeaderID(sluggedID, headerIDMap)
  }

  let header;
  if (postFrontmatter.title || postFrontmatter.title) {
    let dateStr
    if (postFrontmatter.date) {
      let date = new Date(postFrontmatter.date)
      dateStr= date.toLocaleString(postFrontmatter.locale, { month: 'short',  day:"numeric", year:"numeric"})
    }
    header = <header dir={postFrontmatter.dir}>
      <h1 className="title"><Markdown>{postFrontmatter.title}</Markdown></h1>
      <p className="meta">
        <p>{dateStr}</p>
      </p>
      </header>
  }

  let postSummary
  if (postFrontmatter.summary) {
    postSummary = <Markdown>{postFrontmatter.summary}</Markdown>
  }

  let tagsElement;
  if (postFrontmatter.posts) {
    tagsElement = <div className="d-none d-lg-block tags-list sticky-top">
      <Tags
        posts={postFrontmatter.posts}
        selectedTags={selectedTags}
        handleTags={handleTags}
        heading={postFrontmatter.tags_heading||"Tags"}
        dir={postFrontmatter.dir}
      ></Tags>
    </div>
  }

  let toc;
  if (postFrontmatter.toc_heading) {
    toc = <Toc source={postContent} fullScreen={fullScreen} handler={setFullScreen} heading={postFrontmatter.toc_heading} dir={postFrontmatter.dir}/>
  }

  let otherPostsElement;
  if (otherPosts.length > 0 && postFrontmatter.other_posts) {
    otherPostsElement = <OtherPosts posts={otherPosts} heading={postFrontmatter.other_posts_heading}/>
  }

  let contentElement = <Markdown
    options={{
      enforceAtxHeadings: true,
      slugify: slugifyID,
      overrides: {
        pre: PreBlock,
        blockquote: Blockquote,
        a: MDLink,
      }
    }}
  >
    {postContent}
  </Markdown>

  let postsElement;
  if (postFrontmatter.posts) {
    postsElement = <Posts 
      tags={postFrontmatter.posts}
      selectedTags={selectedTags}
      handleTags={handleTags}
      heading={postFrontmatter.posts_section_heading} 
      locale={postFrontmatter.locale}
      dir={postFrontmatter.dir}
    />
  }

  let disqus;
  if (postFrontmatter.comments) {
    disqus = <Disqus.DiscussionEmbed
      shortname={disqusShortname}
      config={disqusConfig}
    />
  }

  return (
    <div className="article-wrapper">
      <div className="sticky">
        <nav className="navbar navbar-expand-lg navbar-light bg-light" id="nav-topNav">
          { 
            <button type="button" className="ml-auto btn-menu rounded-0 navbar-toggler" onClick={useFullScreen}
            style={{visibility: postFrontmatter.toc_heading ? 'visible' : 'hidden' }}>
              <small className="navbar-toggler-icon"></small>
            </button>
          }
          <button type="button" className="mr-auto btn-nav rounded-0 navbar-toggler" data-bs-toggle="collapse" data-bs-target="#div-collapsibleNav" aria-expanded="false">
            <span className="navbar-toggler-icon "></span>
          </button>
          <div className="navbar-collapse collapse" id="div-collapsibleNav">
            <ul className="navbar-nav navbar-menu">
              <hr className="hr-padding"></hr>
              <li key="home" className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              {config.nav?.map((item) => {
                return (
                  <li key={item.title} className="nav-item">
                    {createLink(item.title, item.link, {"class": "nav-link"})}
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>
      <article>
        <header>
        </header>
        <div dir={postFrontmatter.dir} className="container-fluid">
          <div className="row justify-content-center">
            <div className="test3 col d-flex flex-column justify-content-between">
              {tagsElement}
              {toc}
            </div>
            <div id="blog-content" className="blog-content col-lg-8 col-xl-7">
              <div className="content-section markdown-body">
                {header}
                {/*<div className="tags">
                  {postFrontmatter.tags?.map((tag) => {
                    return (
                      <><span className="tags">{"#"+tag}</span>&nbsp;</>
                    );
                  })}
                </div>*/}
                {postSummary}
                {contentElement}
              </div>
              {postsElement}
            </div>
            <div className="col-sm-8 col-md-8 col-lg-8 col-xl-2">
              {otherPostsElement}
              <Author />
            </div>
          </div>
          <div className="row justify-content-center">
            <hr></hr>
            <div className="col-sm-9 col-md-8 col-lg-7 col-xl-5">
              {disqus}
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}

export default Content
