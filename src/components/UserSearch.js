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
                    style={{
                        width: '100%',
                        padding: '12px 40px 12px 42px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
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
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '4px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        maxHeight: '280px',
                        overflowY: 'auto',
                        zIndex: 1002
                    }}
                >
                    {results.map((user) => (
                        <div
                            key={user._id}
                            onClick={() => handleSelect(user)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #e2e8f0',
                                transition: 'background 0.15s'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >
                            <div
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: '#1a5f4a',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 600,
                                    fontSize: '14px'
                                }}
                            >
                                {user.firstName.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 500, color: '#1e293b', fontSize: '14px' }}>
                                    {user.firstName} {user.lastName}
                                </div>
                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                                    {user.email}
                                </div>
                            </div>
                            <i className="ri-arrow-right-line" style={{ color: '#94a3b8' }}></i>
                        </div>
                    ))}
                </div>
            )}

            {showResults && results.length === 0 && query.length >= 2 && !loading && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '4px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '24px',
                        textAlign: 'center',
                        color: '#94a3b8',
                        zIndex: 1002
                    }}
                >
                    <i className="ri-user-search-line" style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}></i>
                    <span>No users found</span>
                </div>
            )}

            {selectedUser && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '8px',
                        padding: '8px 12px',
                        background: '#d1fae5',
                        color: '#10b981',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 500
                    }}
                >
                    <i className="ri-check-line"></i>
                    <span>Sending to: {selectedUser.firstName} {selectedUser.lastName}</span>
                </div>
            )}
        </div>
    );
};

export default UserSearch;
