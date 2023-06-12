import {Link} from "react-router-dom";

const isExternalLink = (url) => {
  const tmp = document.createElement('a');
  tmp.href = url;
  return tmp.host !== window.location.host;
};

const MDLink = ({href, children}) => {

  if (href === "/index.md" || href === "/") {
    return (
      <Link to="/">{children}</Link>
    )
  }

  if (!isExternalLink(href) && href.endsWith(".md")) {
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
