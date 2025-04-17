import React from 'react';
import { useTranslation } from 'react-i18next';
import { CategoryData } from '../types';
import '../styles/Sidebar.css';

interface SidebarProps {
    categories: CategoryData[];
    selectedCategories: string[];
    onCategoryToggle: (categoryId: string) => void;
    language: 'en' | 'se' | 'pt';
    onLanguageChange: (language: 'en' | 'se' | 'pt') => void;
}

// Flag country codes mapping
const flagCountryCodes: Record<string, string> = {
    en: 'gb', // Great Britain flag for English
    se: 'se', // Sweden flag
    pt: 'pt'  // Portugal flag
};

const Sidebar: React.FC<SidebarProps> = ({
    categories,
    selectedCategories,
    onCategoryToggle,
    language,
    onLanguageChange,
}) => {
    const { t, i18n } = useTranslation();

    const handleLanguageChange = (selectedLanguage: 'en' | 'se' | 'pt') => {
        onLanguageChange(selectedLanguage);
        i18n.changeLanguage(selectedLanguage);
    };

    return (
        <div className="sidebar">
            <div className="logo-header-container">
                <img
                    src="/assets/images/SveaVidaLogo.png"
                    alt="SveaVida Logo"
                    className="logo"
                />
                <div className="header">
                    <h1>{t('appTitle')}</h1>
                    <h2>{t('appSubtitle')}</h2>
                </div>
            </div>

            <div className="language-switcher">
                {['en', 'se', 'pt'].map((lang) => (
                    <div
                        key={lang}
                        className={`language-option ${language === lang ? 'active' : ''}`}
                        onClick={() => handleLanguageChange(lang as 'en' | 'se' | 'pt')}
                    >
                        <img
                            src={`https://flagcdn.com/${flagCountryCodes[lang]}.svg`}
                            alt={`${lang.toUpperCase()} flag`}
                            className="flag-icon"
                        />
                        <span className="lang-code">{lang.toUpperCase()}</span>
                    </div>
                ))}
            </div>

            <div className="category-filter">
                <h3>{t('categoriesHeader')}</h3>
                <ul className="category-list">
                    {categories.map((category) => (
                        <li key={category.id} className="category-item">
                            <input
                                type="checkbox"
                                id={`category-${category.id}`}
                                className="category-checkbox"
                                checked={selectedCategories.includes(category.id)}
                                onChange={() => onCategoryToggle(category.id)}
                            />
                            <label htmlFor={`category-${category.id}`}>
                                {category.name[language]}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
