import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dcmmfdc3k/image/upload/v1763458783/Group_7731_rkvjss.png"
            alt="website logo"
            className="nav-logo"
          />
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/shelf">Bookshelves</Link>
          </li>
          <li>
            <button
              type="button"
              className="logout-btn"
              onClick={onClickLogout}
            >
              <h1 role="heading">Logout</h1>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default withRouter(Header)
