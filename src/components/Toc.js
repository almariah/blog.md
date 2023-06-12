import {compiler} from 'markdown-to-jsx'
import React from 'react';

import { useState, useEffect } from "react"

import '../styles/_toc.scss'

export const conformHeaderID = (id, idMap) => {
  if (idMap.hasOwnProperty(id)) {
    id = conformHeaderID(id + "-", idMap)
    return id
   } else {
    idMap[id] = 0
    return id
   }
}

const Toc = ({source, fullScreen, handler, heading, dir}) => {

     const ref = React.useRef();

     const removeShow = () => {
      ref.current.classList.remove('show')
      handler()
    }

    const insertItem = (tocItems, item) => {
      if (tocItems == null) {
        const li = React.createElement("li", {level: item.props.level}, item)
        tocItems = React.createElement("ul", {}, li)
        return tocItems
      }

      let lastItem = {}
      let len = 0
      if (tocItems.props.children.length) {
        len = tocItems.props.children.length
        lastItem = tocItems.props.children[len-1]
        if (item.props.level <= lastItem.props.level) {
          const li = React.createElement("li", {level: item.props.level}, item)
          const lis = tocItems.props.children
          lis.push(li)
          tocItems = React.createElement("ul", {}, lis) 
        } else { 
            let lowerToc = {}
            if (lastItem.props.children.length) {
              lowerToc =  insertItem(lastItem.props.children[1], item)
              const origin = lastItem.props.children[0]
              tocItems.props.children.splice(len-1, 1, React.createElement("li", {level: lastItem.props.level}, [origin, lowerToc]));
            } else {
              lowerToc =  insertItem(null, item)
              const origin = lastItem.props.children
              lastItem = React.createElement("li", {level: lastItem.props.level}, [origin, lowerToc])
              tocItems.props.children.splice(len-1, 1, React.createElement("li", {level: lastItem.props.level}, [origin, lowerToc]));
            }      
        }
      } else {
        lastItem = tocItems.props.children
        if (item.props.level <= lastItem.props.level) {
          const li = React.createElement("li", {level: item.props.level}, item)
          const lis = tocItems.props.children
          tocItems = React.createElement("ul", {}, [lis, li])
        } else {
          let lowerToc = {}
          if (lastItem.props.children.length) {
            lowerToc =  insertItem(lastItem.props.children[1], item)
            const origin = lastItem.props.children[0]
            const li = React.createElement("li", {level: lastItem.props.level}, [origin, lowerToc])
            tocItems = React.createElement("ul", {}, li)
          } else {
            lowerToc =  insertItem(null, item)
            const origin = lastItem.props.children 
            const li = React.createElement("li", {level: lastItem.props.level}, [origin, lowerToc])
            tocItems = React.createElement("ul", {}, li)
          }
        }
      }

      return tocItems
    }

    const buildToc = (source) => { 
        const headerIDMap = {}
        const headings = []
        compiler(source, {
          createElement(type, props, children) {
             if ( type === "h1" || type === "h2" || type === "h3" || type === "h4" ) {
                let level = 0 
                 if (type === "h1") {
                    level = 1
                 } else if (type === "h2") {
                    level = 2
                 } else if (type === "h3") {
                  level = 3
                 } else if (type === "h4") {
                  level = 4
                 }
                 const id = conformHeaderID(props.id, headerIDMap)
                 props = {
                   ...props,
                   level: level,
                   id: 'toc-' + type,
                   href: "#" + id,
                   onClick: () => {
                     //var nav = document.getElementById("TOC");
                     //nav.classList.remove("show");
                     //let target = document.getElementById(id)
                     //target && target.scrollIntoView()
                     removeShow()
                   }
                 }
            

                 headings.push(React.createElement("a", props, children)) 
               }
               return (
                 React.createElement(type, props, children)
               )
             },
         })

         let init = null

         headings.map((entry, index) => { 
          init = insertItem(init, entry)
         })

         return init
      };

  return (
    <nav dir={dir} className={`navbar navbar-expand-lg test ${fullScreen && "test-a"}`} id="toc-sidebar"> 
        <div ref={ref}  className={`navbar-collapse collapse ${fullScreen && "show"}`}>
          <div className="toc sidebar-content markdown-body">
              <div className="test1">
                <h4 className="toc-title">{heading}</h4>
                <button id="x" dir={dir} type="button" className="btn-close navbar-toggler" onClick={removeShow} aria-label="Close"></button>
              </div>
              <div className="test2">
                {buildToc(source)}
              </div>
          </div>
        </div>
        </nav>
  );
};

export default Toc
