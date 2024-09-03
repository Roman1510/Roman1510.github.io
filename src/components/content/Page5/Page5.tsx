import { FaLinkedin } from 'react-icons/fa'

export const Page5 = () => {
  return (
    <div className="section" style={{ backgroundColor: '#c7f9cc' }}>
      <div className="title" style={{ padding: '50px' }}>
        <p style={{ padding: '50px' }}>... in progress, so stay tuned</p>
      </div>
      <div className="contact-me">
        <a
          href="https://www.linkedin.com/in/romanvinnick/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="linkedin-button">
            <FaLinkedin className="linkedin-icon" />
          </button>
        </a>
      </div>
    </div>
  )
}
