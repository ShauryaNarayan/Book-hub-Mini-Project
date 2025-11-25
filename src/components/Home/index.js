import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import {withRouter} from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {books: [], status: apiStatus.initial}

  componentDidMount() {
    this.getTopBooks()
  }

  getTopBooks = async () => {
    this.setState({status: apiStatus.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const url = 'https://apis.ccbp.in/book-hub/top-rated-books'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const updated = data.books.map(each => ({
        id: each.id,
        title: each.title,
        authorName: each.author_name,
        coverPic: each.cover_pic,
      }))
      this.setState({books: updated, status: apiStatus.success})
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  onTryAgain = () => {
    this.getTopBooks()
  }

  onFindBooks = () => {
    const {history} = this.props
    history.push('/shelf')
  }

  renderSlider = () => {
    const {books} = this.state
    const {history} = this.props

    const settings = {
      dots: false,
      infinite: false,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {breakpoint: 992, settings: {slidesToShow: 2}},
        {breakpoint: 576, settings: {slidesToShow: 1}},
      ],
    }

    return (
      <Slider {...settings}>
        {books.map(item => (
          <button
            type="button"
            key={item.id}
            className="carousel-item"
            onClick={() => history.push(`/books/${item.id}`)}
          >
            <img src={item.coverPic} alt={item.title} className="book-cover" />

            <h1 className="book-title">{item.title}</h1>
            <p className="book-author">{item.authorName}</p>
          </button>
        ))}
      </Slider>
    )
  }

  renderFailure = () => (
    <div className="failure-section">
      <img
        src="https://res.cloudinary.com/dcmmfdc3k/image/upload/v1763458783/Group_7522_g9vlge.png"
        alt="failure view"
        className="failure-img"
      />
      <p className="failure-text">Something went wrong. Please try again.</p>
      <button type="button" className="try-again-btn" onClick={this.onTryAgain}>
        Try Again
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderCardContent = () => {
    const {status} = this.state

    switch (status) {
      case apiStatus.inProgress:
        return this.renderLoader()
      case apiStatus.success:
        return this.renderSlider()
      case apiStatus.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="home-container" role="main">
          <h1 className="home-main-heading">Find Your Next Favorite Books?</h1>
          <p className="home-main-description">
            You are in the right place. Tell us what titles or genres you have
            enjoyed in the past, and we will give you surprisingly insightful
            recommendations.
          </p>

          {/* White Card from Figma */}
          <div className="top-rated-card">
            <div className="card-header">
              <h1 className="top-rated-heading">Top Rated Books</h1>
              <button
                type="button"
                className="find-books-btn"
                onClick={this.onFindBooks}
              >
                Find Books
              </button>
            </div>

            <div className="card-slider-section">
              {this.renderCardContent()}
            </div>
          </div>
        </div>

        <Footer />
      </>
    )
  }
}

export default withRouter(Home)
