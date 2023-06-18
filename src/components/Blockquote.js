import '../styles/_admonition.scss'
import '../styles/_alerts.scss'

import { useState, useEffect } from "react"

const alertTypes = {
  alert_: 'Alert',   
  warning_: 'Warning',
  error_: 'Error',
  success_: 'Success',
  note_: 'Note',
}

const regexConst = /^\[!([a-zA-Z]+_?)\]/

const Blockquote = ({className, children}) => {

  let tag = ""
  let title = ""
  let matched;

  const iter = (child) => {

    let iterList = []
    if (!Array.isArray(child)) {
      return iterList
    }

    child.forEach(function (item, index) {
      if (matched == true) {
        iterList.push(item)
        return iterList
      }

      if (item.props != null) {
        iterList.push(iter(item.props.children))
      } else {
        const match = item.match(regexConst);
        if (match != null) {
          matched = true
          tag = match[1].toLowerCase()
          const tag_len = match[0].length
          const first_line = item.split('\n')[0]
          title = first_line.slice(tag_len).trim()
          if (title == "") {
            title = tag.charAt(0).toUpperCase() + tag.slice(1)
          }
          let trimmed = item.slice(first_line.length).trim()
          item = trimmed + '\n'
        }
        iterList.push(item)
      }
    });

    return iterList
  }

  let blockquoteContent = iter(children)

  if (tag == "" || title == "") {
    return (
      <blockquote>
        {blockquoteContent}
      </blockquote>
    );
  }

  if (tag.endsWith("_")) {
    return (
      <div className={alertTypes[tag]}>
        {blockquoteContent}
      </div>
    );
  }

  return (
    <div className={`admonition ${tag}`}>
      <div className="admonition-title">{title}</div>
        <p>{blockquoteContent}</p>
    </div>
  );
}

export default Blockquote
