import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch, BsFillStarFill} from 'react-icons/bs'

import Header from '../Header'
import Footer from '../Footer'
import {bookshelvesList} from '../../App'

import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Bookshelves extends Component {
  state = {
    activeShelf: bookshelvesList[0].value,
    shelfHeading: bookshelvesList[0].label,
    searchInput: '',
    booksList: [],
    status: apiStatus.initial,
  }

  componentDidMount() {
    this.getBooksData()
  }

  getBooksData = async () => {
    this.setState({status: apiStatus.inProgress})

    const {activeShelf, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/book-hub/books?shelf=${activeShelf}&search=${searchInput}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()

      // NO MAPPING — USE RAW API KEYS
      this.setState({
        booksList: data.books,
        status: apiStatus.success,
      })
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  // -------------------- Handlers --------------------

  onShelfClick = (value, label) => {
    this.setState(
      {
        activeShelf: value,
        shelfHeading: label,
      },
      this.getBooksData,
    )
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onSearchClick = () => {
    this.getBooksData()
  }

  // -------------------- Views --------------------

  renderLoader = () => (
    <div className="bookshelves-loader" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderFailure = () => (
    <div className="bookshelves-failure">
      <img
        src="https://res.cloudinary.com/dcmmfdc3k/image/upload/v1763458783/Group_7522_g9vlge.png"
        alt="failure view"
        className="failure-img"
      />
      <p className="failure-msg">Something went wrong. Please try again.</p>
      <button
        type="button"
        className="try-again-btn"
        onClick={this.getBooksData}
      >
        Try Again
      </button>
    </div>
  )

  renderNoBooks = () => {
    const {searchInput} = this.state

    return (
      <div className="bookshelves-no-books">
        <img
          src="https://res.cloudinary.com/dcmmfdc3k/image/upload/v1763458783/Asset_1_1_uvexid.png"
          alt="no books"
          className="no-books-img"
        />
        <p className="no-books-text">
          Your search for {searchInput} did not find any matches.
        </p>
      </div>
    )
  }

  renderBooksList = () => {
    const {booksList} = this.state
    const {history} = this.props

    if (booksList.length === 0) {
      return this.renderNoBooks()
    }

    return (
      <ul className="bs-books-grid">
        {booksList.map(book => (
          <li
            key={book.id}
            className="bs-book-item"
            onClick={() => history.push(`/books/${book.id}`)}
          >
            <img
              src={book.cover_pic}
              alt={book.title}
              className="bs-book-cover"
            />

            <div>
              {/* Title as HEADING – required for tests */}
              <h1 className="bs-book-title">{book.title}</h1>

              <p className="bs-book-author">{book.author_name}</p>

              <p className="bs-book-rating">
                Avg Rating <BsFillStarFill size={14} color="#FBBF24" />{' '}
                {book.rating}
              </p>

              {/* EXACT read_status — NO PREFIX */}
              <p>Status</p>
              <p className="bs-book-status">{book.read_status}</p>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  renderSuccess = () => {
    const {activeShelf, shelfHeading, searchInput} = this.state

    return (
      <div className="bookshelves-layout">
        {/* LEFT SIDEBAR */}
        <div className="bs-left-side">
          <h1 className="bs-left-title">Bookshelves</h1>

          <ul className="bs-left-options">
            {bookshelvesList.map(each => (
              <li key={each.id}>
                <button
                  type="button"
                  className={`bs-left-btn ${
                    activeShelf === each.value ? 'active' : ''
                  }`}
                  onClick={() => this.onShelfClick(each.value, each.label)}
                >
                  {each.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT PANEL */}
        <div className="bs-right-side">
          <div className="bs-right-header">
            <h1 className="bs-right-title">{shelfHeading} Books</h1>
          </div>

          {this.renderBooksList()}
        </div>
      </div>
    )
  }

  renderContent = () => {
    const {status} = this.state

    switch (status) {
      case apiStatus.inProgress:
        return this.renderLoader()
      case apiStatus.success:
        return this.renderSuccess()
      case apiStatus.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        {/* SEARCH */}
        <div className="bs-search-box">
          <input
            type="search"
            name="search"
            placeholder="Search by title"
            className="bs-search-input"
            value={searchInput}
            onChange={this.onChangeSearch}
          />

          <button
            type="button"
            testid="searchButton"
            className="bs-search-btn"
            onClick={this.onSearchClick}
          >
            <BsSearch size={16} />
          </button>
        </div>
        {this.renderContent()}
        <Footer />
      </>
    )
  }
}

export default withRouter(Bookshelves)
