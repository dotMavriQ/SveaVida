import React from 'react';
import { useTranslation } from 'react-i18next';
import { EnhancedLocation } from '../types';
import '../styles/PinDetailModal.css';
import DOMPurify from 'dompurify';

interface PinDetailModalProps {
    location: EnhancedLocation;
    onClose: () => void;
    language: 'en' | 'se' | 'pt';
}

// Function to ensure all links open in new tabs
const sanitizeAndProcessLinks = (html: string): string => {
    // First sanitize the HTML
    const sanitizedHtml = DOMPurify.sanitize(html, {
        ADD_ATTR: ['target', 'rel'] // Allow these attributes
    });

    // Create a temporary DOM element to manipulate the links
    const doc = new DOMParser().parseFromString(sanitizedHtml, 'text/html');

    // Select all links and add target="_blank" and rel="noopener noreferrer"
    const links = doc.querySelectorAll('a');
    links.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });

    // Return the processed HTML
    return doc.body.innerHTML;
};

const PinDetailModal: React.FC<PinDetailModalProps> = ({
    location,
    onClose,
    language,
}) => {
    const { t } = useTranslation();

    // Format opening hours for display
    const formatOpenHours = () => {
        if (typeof location.open_hours === 'string') {
            return location.open_hours;
        } else if (location.open_hours) {
            return Object.entries(location.open_hours)
                .map(([day, hours]) => `${day}: ${hours}`)
                .join('\n');
        }
        return '';
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{location.name}</h2>
                    <button className="close-button" onClick={onClose}>
                        ×
                    </button>
                </div>

                {location.thumbnail && (
                    <div className="location-image">
                        <img src={location.thumbnail} alt={location.name} />
                    </div>
                )}

                <div className="modal-body">
                    {location.description && (
                        <div
                            className="description"
                            dangerouslySetInnerHTML={{
                                __html: sanitizeAndProcessLinks(
                                    location.description[language] || location.description.en
                                )
                            }}
                        />
                    )}

                    {/* Display categories */}
                    {location.categories && location.categories.length > 0 && (
                        <div className="info-section">
                            <h3>{t('categories')}</h3>
                            <div className="categories-list">
                                {location.categories.map(category => (
                                    <span key={category.id} className="category-badge">
                                        {category.name[language]}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {location.website && (
                        <div className="info-section">
                            <a href={location.website} target="_blank" rel="noopener noreferrer" className="website-link">
                                {t('visitWebsite')} →
                            </a>
                        </div>
                    )}

                    {location.open_hours && (
                        <div className="info-section">
                            <h3>{t('openHours')}</h3>
                            <p className="open-hours">{formatOpenHours()}</p>
                        </div>
                    )}

                    <div className="info-section">
                        <h3>{t('location')}</h3>
                        <a href={location.located} target="_blank" rel="noopener noreferrer">
                            Google Maps
                        </a>
                    </div>

                    {location.tags && location.tags.length > 0 && (
                        <div className="info-section">
                            <h3>{t('tags')}</h3>
                            <div className="tags">
                                {location.tags.map(tag => (
                                    <span key={tag} className="tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {location.socials && (location.socials.facebook || location.socials.instagram) && (
                        <div className="info-section">
                            <h3>{t('socialMedia')}</h3>
                            <div className="social-links">
                                {location.socials.facebook && (
                                    <a href={location.socials.facebook} target="_blank" rel="noopener noreferrer">
                                        Facebook
                                    </a>
                                )}
                                {location.socials.instagram && (
                                    <a href={location.socials.instagram} target="_blank" rel="noopener noreferrer">
                                        Instagram
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PinDetailModal;
