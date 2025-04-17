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
            <div className="header">
                <h1>{t('appTitle')}</h1>
                <h2>{t('appSubtitle')}</h2>
            </div>

            <div className="language-switcher">
                <div
                    className={`language-option ${language === 'en' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('en')}
                >
                    🇬🇧 EN
                </div>
                <div
                    className={`language-option ${language === 'se' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('se')}
                >
                    🇸🇪 SE
                </div>
                <div
                    className={`language-option ${language === 'pt' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('pt')}
                >
                    🇵🇹 PT
                </div>
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
