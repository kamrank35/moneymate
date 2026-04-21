import React, { useState, useRef, useEffect } from 'react';
import { SearchUsers } from '../apicalls/Users';

const UserSearch = ({ onSelect, disabled }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (value) => {
        setQuery(value);

        if (value.length < 2) {
            setResults([]);
            setShowResults(false);
            return;
        }

        // Immediate search, no debounce for debugging
        setLoading(true);
        SearchUsers(value)
            .then((response) => {
                console.log('Search response:', response);
                if (response.success) {
                    setResults(response.data || []);
                    setShowResults(true);
                } else {
                    setResults([]);
                }
            })
            .catch((error) => {
                console.error('Search error:', error);
                setResults([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleSelect = (user) => {
        setSelectedUser(user);
        setQuery(`${user.firstName} ${user.lastName} (${user.email})`);
        setShowResults(false);
        onSelect(user);
    };

    const handleClear = () => {
        setSelectedUser(null);
        setQuery('');
        setResults([]);
        onSelect(null);
    };

    return (
        <div className="user-search-container" ref={containerRef}>
            <div style={{ position: 'relative' }}>
                <i
                    className="ri-search-line"
                    style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8',
                        fontSize: '18px',
                        zIndex: 1,
                        pointerEvents: 'none'
                    }}
                ></i>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => query.length >= 2 && setShowResults(true)}
                    placeholder="Search by name, email, or phone..."
                    disabled={disabled}
                    className="user-search-input"
                    style={{
                        width: '100%',
                        padding: '12px 40px 12px 42px',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        backgroundColor: 'var(--surface)',
                        color: 'var(--text-primary)'
                    }}
                />
                {loading && (
                    <i
                        className="ri-loader-4-line"
                        style={{
                            position: 'absolute',
                            right: '14px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#94a3b8',
                            fontSize: '16px',
                            animation: 'spin 1s linear infinite'
                        }}
                    ></i>
                )}
                {selectedUser && !disabled && (
                    <button
                        type="button"
                        onClick={handleClear}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '4px'
                        }}
                    >
                        <i className="ri-close-line"></i>
                    </button>
                )}
            </div>

            {showResults && results.length > 0 && (
                <div className="user-search-results">
                    {results.map((user) => (
                        <div
                            key={user._id}
                            onClick={() => handleSelect(user)}
                            className="user-search-result-item"
                        >
                            <div className="user-avatar-small">
                                {user.firstName.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className="user-name-text">
                                    {user.firstName} {user.lastName}
                                </div>
                                <div className="user-email-text">
                                    {user.email}
                                </div>
                            </div>
                            <i className="ri-arrow-right-line"></i>
                        </div>
                    ))}
                </div>
            )}

            {showResults && results.length === 0 && query.length >= 2 && !loading && (
                <div className="user-search-no-results">
                    <i className="ri-user-search-line"></i>
                    <span>No users found</span>
                </div>
            )}

            {selectedUser && (
                <div className="selected-user-badge">
                    <i className="ri-check-line"></i>
                    <span>Sending to: {selectedUser.firstName} {selectedUser.lastName}</span>
                </div>
            )}
        </div>
    );
};

export default UserSearch;
