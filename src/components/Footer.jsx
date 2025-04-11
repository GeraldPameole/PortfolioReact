import { Icon } from "@iconify/react";
import "../styles/footer.css";

const Footer = ({ data }) => {
  // Constantes pour les liens et informations de contact
  const socialLinks = data?.socialLinks || [];
  const contactEmail = data?.email || "contact@example.com";
  const copyright =
    data?.copyright || `© ${new Date().getFullYear()} Portfolio`;

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Contact</h3>
          <p>
            <a href={`mailto:${contactEmail}`} className="footer-email">
              {contactEmail}
            </a>
          </p>
        </div>

        <div className="footer-section">
          <h3>Suivez-moi</h3>
          <ul className="social-links">
            {socialLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                >
                  <Icon icon={link.icon} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <p className="copyright">{copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
