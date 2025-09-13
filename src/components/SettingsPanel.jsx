import React, { useState, useEffect } from 'react';

const CustomSettingsPanel = () => {
    // Default settings
    const defaultSettings = {
        theme: 'light',
        primaryColor: '#6366f1',
        fontSize: 16,
        spacing: 'comfortable',
        sidebar: true,
        animations: true,
        fontFamily: 'system-ui'
    };

    // State for settings
    const [settings, setSettings] = useState(defaultSettings);
    const [isSaved, setIsSaved] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? checked : value
        });
        setIsSaved(false);
    };

    // Save settings (simulate API call)
    const saveSettings = () => {
        console.log('Saving settings:', settings);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    // Reset to defaults
    const resetSettings = () => {
        setSettings(defaultSettings);
        setIsSaved(false);
    };

    // Apply settings to preview
    useEffect(() => {
        document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
        document.documentElement.style.setProperty('--font-size', `${settings.fontSize}px`);
        document.documentElement.style.setProperty('--font-family', settings.fontFamily);
    }, [settings]);

    // Styles
    const styles = {
        container: {
            fontFamily: settings.fontFamily,
            maxWidth: '800px',
            margin: '2rem auto',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            backgroundColor: settings.theme === 'dark' ? '#1e293b' : '#ffffff',
            color: settings.theme === 'dark' ? '#f8fafc' : '#1e293b',
            transition: 'all 0.3s ease'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: `1px solid ${settings.theme === 'dark' ? '#334155' : '#e2e8f0'}`
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: '600',
            margin: '0',
            color: 'var(--primary-color)'
        },
        section: {
            marginBottom: '2rem'
        },
        sectionTitle: {
            fontSize: '1.1rem',
            fontWeight: '600',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        },
        settingGroup: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '1.5rem'
        },
        settingItem: {
            marginBottom: '1rem'
        },
        label: {
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            fontSize: '0.95rem'
        },
        input: {
            width: '100%',
            padding: '0.5rem',
            borderRadius: '6px',
            border: `1px solid ${settings.theme === 'dark' ? '#334155' : '#cbd5e1'}`,
            backgroundColor: settings.theme === 'dark' ? '#1e293b' : '#ffffff',
            color: settings.theme === 'dark' ? '#f8fafc' : '#1e293b',
            fontSize: '0.95rem'
        },
        select: {
            width: '100%',
            padding: '0.5rem',
            borderRadius: '6px',
            border: `1px solid ${settings.theme === 'dark' ? '#334155' : '#cbd5e1'}`,
            backgroundColor: settings.theme === 'dark' ? '#1e293b' : '#ffffff',
            color: settings.theme === 'dark' ? '#f8fafc' : '#1e293b',
            fontSize: '0.95rem'
        },
        checkboxContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        },
        checkbox: {
            width: '1.1rem',
            height: '1.1rem',
            accentColor: 'var(--primary-color)'
        },
        colorInput: {
            width: '3rem',
            height: '3rem',
            padding: '0.2rem',
            borderRadius: '6px',
            border: `1px solid ${settings.theme === 'dark' ? '#334155' : '#cbd5e1'}`,
            cursor: 'pointer'
        },
        rangeContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
        },
        rangeInput: {
            flex: '1',
            accentColor: 'var(--primary-color)'
        },
        rangeValue: {
            minWidth: '2.5rem',
            textAlign: 'center',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            backgroundColor: settings.theme === 'dark' ? '#334155' : '#e2e8f0'
        },
        buttons: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            marginTop: '2rem'
        },
        button: {
            padding: '0.6rem 1.2rem',
            borderRadius: '6px',
            border: 'none',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        },
        saveButton: {
            backgroundColor: 'var(--primary-color)',
            color: '#ffffff',
            '&:hover': {
                opacity: '0.9'
            }
        },
        resetButton: {
            backgroundColor: settings.theme === 'dark' ? '#334155' : '#e2e8f0',
            color: settings.theme === 'dark' ? '#f8fafc' : '#1e293b',
            '&:hover': {
                backgroundColor: settings.theme === 'dark' ? '#475569' : '#cbd5e1'
            }
        },
        savedIndicator: {
            opacity: isSaved ? 1 : 0,
            transition: 'opacity 0.3s ease',
            color: '#10b981',
            fontWeight: '500',
            marginRight: '1rem'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Custom Settings</h1>
                <div style={styles.savedIndicator}>✓ Settings saved</div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Appearance</h2>
                <div style={styles.settingGroup}>
                    <div style={styles.settingItem}>
                        <label style={styles.label} htmlFor="theme">
                            Theme
                        </label>
                        <select
                            style={styles.select}
                            id="theme"
                            name="theme"
                            value={settings.theme}
                            onChange={handleChange}
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>

                    <div style={styles.settingItem}>
                        <label style={styles.label} htmlFor="primaryColor">
                            Primary Color
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <input
                                style={styles.colorInput}
                                type="color"
                                id="primaryColor"
                                name="primaryColor"
                                value={settings.primaryColor}
                                onChange={handleChange}
                            />
                            <span>{settings.primaryColor}</span>
                        </div>
                    </div>

                    <div style={styles.settingItem}>
                        <label style={styles.label} htmlFor="fontFamily">
                            Font Family
                        </label>
                        <select
                            style={styles.select}
                            id="fontFamily"
                            name="fontFamily"
                            value={settings.fontFamily}
                            onChange={handleChange}
                        >
                            <option value="system-ui">System UI</option>
                            <option value="Arial, sans-serif">Arial</option>
                            <option value="Georgia, serif">Georgia</option>
                            <option value="'Courier New', monospace">Courier New</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Layout</h2>
                <div style={styles.settingGroup}>
                    <div style={styles.settingItem}>
                        <label style={styles.label} htmlFor="fontSize">
                            Font Size: <span style={styles.rangeValue}>{settings.fontSize}px</span>
                        </label>
                        <div style={styles.rangeContainer}>
                            <span>12</span>
                            <input
                                style={styles.rangeInput}
                                type="range"
                                id="fontSize"
                                name="fontSize"
                                min="12"
                                max="24"
                                value={settings.fontSize}
                                onChange={handleChange}
                            />
                            <span>24</span>
                        </div>
                    </div>

                    <div style={styles.settingItem}>
                        <label style={styles.label} htmlFor="spacing">
                            Spacing
                        </label>
                        <select
                            style={styles.select}
                            id="spacing"
                            name="spacing"
                            value={settings.spacing}
                            onChange={handleChange}
                        >
                            <option value="compact">Compact</option>
                            <option value="comfortable">Comfortable</option>
                            <option value="spacious">Spacious</option>
                        </select>
                    </div>

                    <div style={styles.settingItem}>
                        <div style={styles.checkboxContainer}>
                            <input
                                style={styles.checkbox}
                                type="checkbox"
                                id="sidebar"
                                name="sidebar"
                                checked={settings.sidebar}
                                onChange={handleChange}
                            />
                            <label style={styles.label} htmlFor="sidebar">
                                Show Sidebar
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Preferences</h2>
                <div style={styles.settingGroup}>
                    <div style={styles.settingItem}>
                        <div style={styles.checkboxContainer}>
                            <input
                                style={styles.checkbox}
                                type="checkbox"
                                id="animations"
                                name="animations"
                                checked={settings.animations}
                                onChange={handleChange}
                            />
                            <label style={styles.label} htmlFor="animations">
                                Enable Animations
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div style={styles.buttons}>
                <button
                    style={{ ...styles.button, ...styles.resetButton }}
                    type="button"
                    onClick={resetSettings}
                >
                    Reset Defaults
                </button>
                <button
                    style={{ ...styles.button, ...styles.saveButton }}
                    type="button"
                    onClick={saveSettings}
                >
                    Save Settings
                </button>
            </div>
        </div>
    );
};

export default CustomSettingsPanel;