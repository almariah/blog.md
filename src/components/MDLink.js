import {Link} from "react-router-dom";

const MDLink = ({href, children}) => {

  if (href == "/index.md" || href == "/") {
    return (
      <Link to="/">{children}</Link>
    )
  }

  if (href.startsWith("/posts/")) {
    href = href.replace(/\.md$/, "")
    return (
      <Link to={href}>{children}</Link>
    )
  }

  return (
    <a href={href}>{children}</a>
  )
};

export default MDLink 
