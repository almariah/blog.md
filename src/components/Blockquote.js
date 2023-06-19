import '../styles/_admonition.scss'
import '../styles/_alerts.scss'

const alertTypes = {
  alert_: 'Alert',   
  warning_: 'Warning',
  error_: 'Error',
  success_: 'Success',
  note_: 'Note',
}

const regexConst = /^\[!([a-zA-Z]+_?)\]/

const Blockquote = ({children}) => {

  let tag = ""
  let title = ""
  let matched;

  const modifyContent = (children) => {

    let contentList = []
    if (!Array.isArray(children)) {
      return contentList
    }

    children.forEach(function (child, index) {
      if (matched == true) {
        contentList.push(child)
        return contentList
      }

      if (child.props != null) {
        contentList.push(modifyContent(child.props.children))
      } else {
        const match = child.match(regexConst);
        if (match != null) {
          matched = true
          tag = match[1].toLowerCase()
          const tag_len = match[0].length
          const first_line = child.split('\n')[0]
          title = first_line.slice(tag_len).trim()
          if (title == "") {
            title = tag.charAt(0).toUpperCase() + tag.slice(1)
          }
          let trimmed = child.slice(first_line.length).trim()
          child = trimmed + '\n'
        }
        contentList.push(child)
      }
    });

    return contentList
  }

  let contentList = modifyContent(children)

  if (tag == "" || title == "") {
    return (
      <blockquote>
        {contentList}
      </blockquote>
    );
  }

  if (tag.endsWith("_")) {
    return (
      <div className={alertTypes[tag]}>
        {contentList}
      </div>
    );
  }

  return (
    <div className={`admonition ${tag}`}>
      <div className="admonition-title">{title}</div>
        <p>{contentList}</p>
    </div>
  );
}

export default Blockquote
