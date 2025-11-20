import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsFillStarFill} from 'react-icons/bs'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class BookDetails extends Component {
  state = {book: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getBookDetails()
  }

  getBookDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/book-hub/books/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const details = data.book_details
      const updated = {
        id: details.id,
        title: details.title,
        authorName: details.author_name,
        coverPic: details.cover_pic,
        aboutBook: details.about_book,
        aboutAuthor: details.about_author,
        rating: details.rating,
        readStatus: details.read_status,
      }
      this.setState({book: updated, apiStatus: apiStatusConstants.success})
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://res.cloudinary.com/dcmmfdc3k/image/upload/v1763458783/Group_7522_g9vlge.png"
        alt="failure view"
      />
      <p>Something went wrong. Please try again.</p>
      <button type="button" onClick={this.getBookDetails}>
        Try Again
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {book} = this.state

    return (
      <div className="book-details-container">
        <div className="top-section">
          <img src={book.coverPic} alt={book.title} />
          <div>
            <h1>{book.title}</h1>
            <p>{book.authorName}</p>
            <p>
              Avg Rating <BsFillStarFill /> {book.rating}
            </p>
            <p>Status: {book.readStatus}</p>
          </div>
        </div>
        <hr />
        <h1>About Author</h1>
        <p>{book.aboutAuthor}</p>
        <h1>About Book</h1>
        <p>{book.aboutBook}</p>
      </div>
    )
  }

  renderContent = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderContent()}
        <Footer />
      </>
    )
  }
}

export default BookDetails
