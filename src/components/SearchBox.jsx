import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronRight, Clock } from 'react-feather';
import styled, { keyframes, css } from 'styled-components';
import PropTypes from 'prop-types';

// ======================
// ANIMATIONS
// ======================
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
    from { transform: translateX(-10px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.5); }
  70% { box-shadow: 0 0 0 8px rgba(99, 102, 241, 0); }
  100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// ======================
// STYLED COMPONENTS
// ======================
const SearchContainer = styled.div`
    position: relative;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 10;

    ${({ $focus }) => $focus && css`
        max-width: 520px;
    `}

    @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 16px;
}
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 16px 60px 16px 52px;
    font-size: 16px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    background: #ffffff;
    color: #1e293b;
    font-weight: 500;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    appearance: none;
    outline: none;
    line-height: 1.5;

    &::placeholder {
        color: #94a3b8;
        font-weight: 400;
        transition: all 0.3s ease;
    }

    &:hover {
        border-color: #cbd5e1;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03);
    }

    &:focus {
        border-color: #6366f1;
        box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.2);
        animation: ${pulse} 2s infinite;

        &::placeholder {
            transform: translateX(4px);
        }
    }

    ${({ $hasValue }) => $hasValue && css`
        padding-right: 80px;
    `}
`;

const SearchIcon = styled(Search)`
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    width: 20px;
    height: 20px;
    pointer-events: none;
    transition: all 0.3s ease;

    ${({ $focus }) => $focus && css`
        color: #6366f1;
        transform: translateY(-50%) scale(1.1);
    `}
`;

const ClearButton = styled.button`
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 6px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    opacity: ${({ $visible }) => $visible ? 1 : 0};
    visibility: ${({ $visible }) => $visible ? 'visible' : 'hidden'};
    transform: ${({ $visible }) => $visible ? 'translateY(-50%)' : 'translateY(-50%) translateX(10px)'};

    &:hover {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
        transform: translateY(-50%) scale(1.1);
    }

    svg {
        width: 18px;
        height: 18px;
    }
`;

const SearchSuggestions = styled.div`
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
    z-index: 100;
    overflow: hidden;
    opacity: 0;
    transform: translateY(-10px);
    visibility: hidden;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    max-height: min(400px, 60vh);
    overflow-y: auto;
    border: 1px solid #f1f5f9;

    ${({ $visible }) => $visible && css`
        opacity: 1;
        transform: translateY(0);
        visibility: visible;
        animation: ${fadeIn} 0.3s ease-out;
    `}

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: #f8fafc;
    }

    &::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 3px;
    }
`;

const SuggestionItem = styled.div`
    padding: 14px 20px;
    cursor: pointer;
    color: #475569;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border-bottom: 1px solid #f1f5f9;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: #f8fafc;
        color: #334155;
    }

    &:active {
        background: #f1f5f9;
    }

    svg {
        width: 16px;
        height: 16px;
        color: #94a3b8;
        flex-shrink: 0;
    }
`;

const SuggestionContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
`;

const SuggestionText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SuggestionType = styled.span`
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #e0e7ff;
  color: #6366f1;
  font-weight: 500;
`;

const RecentSearchesHeader = styled.div`
  padding: 12px 20px;
  background: #f8fafc;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #f1f5f9;
`;

const NoResults = styled.div`
  padding: 20px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
`;

const GradientBorder = styled.div`
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 12px;
  background: linear-gradient(45deg, #6366f1, #8b5cf6, #ec4899);
  background-size: 200% 200%;
  animation: ${gradientShift} 6s ease infinite;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${({ $focus }) => $focus && css`
    opacity: 0.3;
  `}
`;

// ======================
// COMPONENT
// ======================
const SearchBox = ({
                       value,
                       onChange,
                       placeholder = "Search products...",
                       suggestions = [],
                       recentSearches = [],
                       onSuggestionSelect,
                       isLoading = false
                   }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);

    const handleClear = (e) => {
        e.stopPropagation();
        onChange('');
        inputRef.current.focus();
    };

    const handleSuggestionClick = (suggestion) => {
        onChange(suggestion);
        if (onSuggestionSelect) onSuggestionSelect(suggestion);
        setShowSuggestions(false);
        inputRef.current.focus();
    };

    useEffect(() => {
        setShowSuggestions(isFocused && (value.length > 0 || recentSearches.length > 0));
    }, [isFocused, value, suggestions, recentSearches]);

    return (
        <SearchContainer $focus={isFocused}>
            <GradientBorder $focus={isFocused} />

            <SearchInput
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                $hasValue={value.length > 0}
                aria-label="Search products"
            />

            <SearchIcon $focus={isFocused} />

            <ClearButton
                onClick={handleClear}
                $visible={value.length > 0 && !isLoading}
                aria-label="Clear search"
            >
                <X />
            </ClearButton>

            <SearchSuggestions $visible={showSuggestions}>
                {isLoading ? (
                    <SuggestionItem>
                        <SuggestionContent>
                            <Clock size={16} />
                            <SuggestionText>Loading suggestions...</SuggestionText>
                        </SuggestionContent>
                    </SuggestionItem>
                ) : value.length > 0 && suggestions.length === 0 ? (
                    <NoResults>No results found for "{value}"</NoResults>
                ) : (
                    <>
                        {recentSearches.length > 0 && value.length === 0 && (
                            <RecentSearchesHeader>
                                <Clock size={14} />
                                Recent searches
                            </RecentSearchesHeader>
                        )}

                        {(value.length > 0 ? suggestions : recentSearches).map((suggestion, index) => (
                            <SuggestionItem
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                <SuggestionContent>
                                    {value.length > 0 ? (
                                        <Search size={16} />
                                    ) : (
                                        <Clock size={16} />
                                    )}
                                    <SuggestionText>{suggestion}</SuggestionText>
                                    {value.length > 0 && (
                                        <SuggestionType>Product</SuggestionType>
                                    )}
                                </SuggestionContent>
                                <ChevronRight size={16} />
                            </SuggestionItem>
                        ))}
                    </>
                )}
            </SearchSuggestions>
        </SearchContainer>
    );
};

SearchBox.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    suggestions: PropTypes.arrayOf(PropTypes.string),
    recentSearches: PropTypes.arrayOf(PropTypes.string),
    onSuggestionSelect: PropTypes.func,
    isLoading: PropTypes.bool
};

SearchBox.defaultProps = {
    placeholder: "Search products...",
    suggestions: [],
    recentSearches: [],
    isLoading: false
};

export default SearchBox;