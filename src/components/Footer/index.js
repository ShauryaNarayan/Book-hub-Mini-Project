import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import './index.css'

const Footer = () => (
  <footer className="footer">
    <div className="footer-icons">
      <button type="button" className="footer-icon-btn">
        <FaGoogle />
      </button>
      <button type="button" className="footer-icon-btn">
        <FaTwitter />
      </button>
      <button type="button" className="footer-icon-btn">
        <FaInstagram />
      </button>
      <button type="button" className="footer-icon-btn">
        <FaYoutube />
      </button>
    </div>
    <p className="footer-text">Contact us</p>
  </footer>
)

export default Footer
