import React, { useState, useEffect } from 'react';
import './App.css';
import { scrollIntoView } from './utils';

function App() {
  const [searchText, setSearchText] = useState('');
  const [source, setSource] = useState([]);
  const [result, setResult] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    fetch('http://www.mocky.io/v2/5ba8efb23100007200c2750c')
      .then(function(response) {
        return response.json();
      })
      .then(function(jsonRes) {
        setSource(jsonRes);
        console.log(JSON.stringify(jsonRes));
      });
  }, []);

  useEffect(() => {
    const activeItem = document.querySelector('.item-wrapper.active');
    if (!activeItem) return;

    if ('scrollIntoView' in document.body) {
      activeItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    } else {
      const scrollEle = document.querySelector('.match-dialog');
      scrollIntoView(scrollEle, activeItem);
    }
  }, [highlightedIndex]);

  const resetStates = () => {
    setSearchText('');
    setResult([]);
    setHighlightedIndex(-1);
  };

  const onSearchInput = e => {
    e.stopPropagation();
    const searchVal = e.target.value;

    setSearchText(searchVal);
    doSearch(searchVal);
  };

  const doSearch = value => {
    if (!value) return setResult([]);

    setResult(
      source.filter(item => {
        const { name = '', id = '', address = '', pincode = '' } = item || {};
        return (
          name.match(value) ||
          id.match(value) ||
          address.match(value) ||
          pincode.match(value)
        );
      }),
    );
  };

  const shouldShowNoUser = () => searchText && result.length === 0;

  const generateSearchedMarkup = text => ({
    __html: text.includes(searchText)
      ? text.replace(searchText, `<span class="highlight">${searchText}</span>`)
      : text,
  });

  const onKeyPress = e => {
    // UP ARROW Key
    if (e.keyCode === 38 && highlightedIndex > 0)
      setHighlightedIndex(highlightedIndex - 1);

    // DOWN ARROW Key
    if (e.keyCode === 40 && result.length - 1 > highlightedIndex) {
      setHighlightedIndex(highlightedIndex + 1);
    }

    // ENTER Key
    if (e.keyCode === 13) {
      this.onItemClick(result[highlightedIndex], e);
    }
  };

  const onHover = itemIndex => setHighlightedIndex(itemIndex);

  const onItemClick = e => {
    e.stopPropagation();
    e.preventDefault();

    alert(highlightedIndex);
  };

  return (
    <div className="App">
      <header className="App-header">Auto Suggest Dialog</header>
      <main>
        <div className="input-wrapper">
          <div className="icon-search" />
          <input
            id="search-input"
            type="text"
            size="20"
            value={searchText}
            onKeyDown={onKeyPress}
            placeholder="Search users by ID, Name, Address ..."
            onChange={onSearchInput}
          />
          {searchText && (
            <div className="icon-close" onClick={resetStates}>
              &#x292C;
            </div>
          )}

          <div className="match-dialog">
            {result.map((item, index) => {
              const { id, name, address, pincode } = item || {};
              return (
                <div
                  className={`item-wrapper ${
                    highlightedIndex === index ? 'active' : ''
                  }`}
                  key={item.name}
                  onMouseOver={() => onHover(index)}
                  onClick={onItemClick}
                >
                  <div
                    className="id"
                    dangerouslySetInnerHTML={generateSearchedMarkup(id)}
                  />
                  <div
                    className="name"
                    dangerouslySetInnerHTML={generateSearchedMarkup(name)}
                  />
                  <div
                    className="addr"
                    dangerouslySetInnerHTML={generateSearchedMarkup(address)}
                  />
                  <div
                    className="pincode"
                    dangerouslySetInnerHTML={generateSearchedMarkup(pincode)}
                  />
                </div>
              );
            })}
            {shouldShowNoUser() && (
              <div className="no-results">No User Found</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
