import '../styles/_other-posts.scss'

import Posts, {createLink} from "./Posts"

const OtherPosts = ({posts, heading}) => {
  return (
    <div className="other-posts">
      <section className="card">

        <div className="card-header">
          {heading}
        </div>

        <div id="other_posts" className="list-group list-group-flush">
          {posts?.map((item) => {
            return (
              createLink(item.title, item.link, {className: "list-group-item"})
            );
          })}
        </div>

      </section>
    </div>
  )
}

export default OtherPosts
