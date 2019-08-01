import React, { useEffect } from 'react';
import { scrollIntoView } from './utils';

export default React.memo(function AutoSuggestDialog(props) {
  const {
    activeIndex = -1,
    onItemClick,
    items = [],
    searchQuery = '',
    onHover,
  } = props || {};

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
  }, [activeIndex]);

  const shouldShowNoUser = () => searchQuery && items.length === 0;

  const generateSearchedMarkup = text => ({
    __html: text.includes(searchQuery)
      ? text.replace(
          searchQuery,
          `<span class="highlight">${searchQuery}</span>`,
        )
      : text,
  });

  return (
    <div className="match-dialog">
      {items.map((item, index) => {
        const { id, name, address, pincode } = item || {};
        return (
          <div
            className={`item-wrapper ${activeIndex === index ? 'active' : ''}`}
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
      {shouldShowNoUser() && <div className="no-results">No User Found</div>}
    </div>
  );
});
