import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-bg">
    <img
      src="https://res.cloudinary.com/dcmmfdc3k/image/upload/v1763458783/Group_7484_wwgkxh.png"
      alt="not found"
      className="not-found-img"
    />
    <h1 className="not-found-heading">Page Not Found</h1>
    <p className="not-found-text">
      we are sorry, the page you requested could not be found, Please go back to
      the homepage
    </p>

    {/* REQUIRED BY TEST CASES */}
    <Link to="/">
      <button type="button" className="not-found-btn">
        Go Back to Home
      </button>
    </Link>
  </div>
)

export default NotFound
