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

// Tag translations for the three supported languages
const tagTranslations: Record<string, Record<string, string>> = {
    // A
    "aivar": { en: "Aivar", se: "Aivar", pt: "Aivar" },

    // B
    "bistro": { en: "Bistro", se: "Bistro", pt: "Bistrô" },
    "brunch": { en: "Brunch", se: "Brunch", pt: "Brunch" },

    // C
    "coffee": { en: "Coffee", se: "Kaffe", pt: "Café" },
    "cheese doodles": { en: "Cheese doodles", se: "Ostbågar", pt: "Salgadinhos de queijo" },

    // D
    "dutch": { en: "Dutch", se: "Holländsk", pt: "Holandês" },

    // E
    "eastern european": { en: "Eastern European", se: "Östeuropeisk", pt: "Leste Europeu" },
    "electronics": { en: "Electronics", se: "Elektronik", pt: "Eletrônicos" },
    "events": { en: "Events", se: "Evenemang", pt: "Eventos" },

    // F
    "festivals": { en: "Festivals", se: "Festivaler", pt: "Festivais" },
    "fika": { en: "Fika", se: "Fika", pt: "Fika" },
    "fine dining": { en: "Fine dining", se: "Fin matlagning", pt: "Alta gastronomia" },
    "furniture": { en: "Furniture", se: "Möbler", pt: "Móveis" },

    // G
    "gadgets": { en: "Gadgets", se: "Prylar", pt: "Gadgets" },
    "gravlax": { en: "Gravlax", se: "Gravlax", pt: "Gravlax" },

    // H
    "home decor": { en: "Home decor", se: "Heminredning", pt: "Decoração" },

    // I
    "indian snus": { en: "Indian snus", se: "Indiskt snus", pt: "Snus indiano" },

    // J
    "julmust": { en: "Julmust", se: "Julmust", pt: "Julmust" },

    // K
    "kex": { en: "Biscuits", se: "Kex", pt: "Biscoitos" },
    "knäckebröd": { en: "Crispbread", se: "Knäckebröd", pt: "Pão crocante" },

    // L
    "lingonsylt": { en: "Lingonberry jam", se: "Lingonsylt", pt: "Geleia de lingonberry" },

    // M
    "marina view": { en: "Marina view", se: "Marina utsikt", pt: "Vista para a marina" },

    // N
    "nicotine pouches": { en: "Nicotine pouches", se: "Nikotinpåsar", pt: "Bolsas de nicotina" },
    "nordic": { en: "Nordic", se: "Nordisk", pt: "Nórdico" },
    "nordic dishes": { en: "Nordic dishes", se: "Nordiska rätter", pt: "Pratos nórdicos" },

    // O
    "open sandwiches": { en: "Open sandwiches", se: "Öppna smörgåsar", pt: "Sanduíches abertos" },

    // P
    "pastries": { en: "Pastries", se: "Bakverk", pt: "Pastelaria" },
    "peanut butter rings": { en: "Peanut butter rings", se: "Jordnötsringar", pt: "Anéis de manteiga de amendoim" },
    "pickled vegetables": { en: "Pickled vegetables", se: "Inlagda grönsaker", pt: "Vegetais em conserva" },
    "podravka": { en: "Podravka", se: "Podravka", pt: "Podravka" },
    "polarbröd": { en: "Polarbröd", se: "Polarbröd", pt: "Polarbröd" },
    "preserves": { en: "Preserves", se: "Konserver", pt: "Conservas" },

    // R
    "restaurant": { en: "Restaurant", se: "Restaurang", pt: "Restaurante" },
    "russian": { en: "Russian", se: "Rysk", pt: "Russo" },

    // S
    "scandi": { en: "Scandi", se: "Skandi", pt: "Escandinavo" },
    "scandinavian food": { en: "Scandinavian food", se: "Skandinavisk mat", pt: "Comida escandinava" },
    "scandinavian snacks": { en: "Scandinavian snacks", se: "Skandinaviska snacks", pt: "Lanches escandinavos" },
    "scandinavian toast": { en: "Scandinavian toast", se: "Skandinavisk toast", pt: "Tosta escandinava" },
    "seafood": { en: "Seafood", se: "Skaldjur", pt: "Frutos do mar" },
    "smørrebrød": { en: "Smørrebrød", se: "Smörrebröd", pt: "Smørrebrød" },
    "snus": { en: "Snus", se: "Snus", pt: "Snus" },
    "street food": { en: "Street food", se: "Gatumat", pt: "Comida de rua" },
    "swedish crisps": { en: "Swedish crisps", se: "Svenska chips", pt: "Batatas fritas suecas" },
    "swedish food": { en: "Swedish food", se: "Svensk mat", pt: "Comida sueca" },

    // U
    "ukrainian": { en: "Ukrainian", se: "Ukrainsk", pt: "Ucraniano" },
};

// Function to translate a tag based on language
const translateTag = (tag: string, language: 'en' | 'se' | 'pt'): string => {
    const normalizedTag = tag.toLowerCase();
    if (tagTranslations[normalizedTag]) {
        return tagTranslations[normalizedTag][language] || tag;
    }
    return tag; // Return original tag if no translation found
};

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
                                    <span key={tag} className="tag">
                                        {translateTag(tag, language)}
                                    </span>
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
