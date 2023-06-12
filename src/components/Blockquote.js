import '../styles/_admonition.scss'
import '../styles/_alerts.scss'

const alertTypes = {
  alert_: 'Alert',   
  warning_: 'Warning',
  error_: 'Error',
  success_: 'Success',
  note_: 'Note',
}

const Blockquote = ({className, children}) => {
  
  //if (className && className.startsWith('lang-')) {
    //lang = className.replace('lang-', '');
  //}

  const start = children[0]
  const start1 = start.props.children[0]

  let tag = ""
  let title = ""

  let trimmed = null

  /// fix lne break S       S

  if (start1 != null) {
    let regexConst = /^\[!([a-zA-Z]+_?)\]/
    const match = start1.match(regexConst);
    if (match != null) {
      tag = match[1].toLowerCase()
      const tag_len = match[0].length
      const first_line = start1.split('\n')[0]
      title = first_line.slice(tag_len).trim()
      if (title == "") {
        title = tag.charAt(0).toUpperCase() + tag.slice(1);
      }
      trimmed = start1.slice(first_line.length).trim()
    }

  }

  if (tag == "" || title == "") {
    return (
      <blockquote>
        {children}
      </blockquote>
    );
  }

  if (tag.endsWith("_")) {
    return (
      <div className={alertTypes[tag]}>
        {children}
      </div>
    );
  }

  return (
    <div className={`admonition ${tag}`}>
      <p className="admonition-title">{title}</p>
      {children}
    </div>
  );
}

export default Blockquote