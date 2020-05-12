import React, { forwardRef, useRef, useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import { levelColors } from 'consts';

import './Leaf.scss';

const Leaf = forwardRef(({ label, subordinates, level }, leafRef) => {
  const firstSubRef = useRef(null);
  const lastSubRef = useRef(null);
  const [branchWidth, setBranchWidth] = useState();
  const [branchLeft, setBranchLeft] = useState();

  const color = levelColors[(level >= levelColors.length) ? (levelColors.length - 1) : level];

  const labelStyle = {
    backgroundColor: color
  };

  const branchStyle = {
    width: branchWidth,
    left: branchLeft,
    backgroundColor: color
  };

  const rootStyle = {
    backgroundColor: color
  };

  const selectRef = (i) => {
    if (i === subordinates.length - 1) return lastSubRef;
    if (i === 0) return firstSubRef;
    return null;
  };

  useLayoutEffect(() => {
    if (!lastSubRef || !lastSubRef.current) return;
    if (!firstSubRef || !firstSubRef.current) return;

    const first = $(firstSubRef.current);
    const last = $(lastSubRef.current);

    const firstLeft = first.offset().left;
    const lastLeft = last.offset().left;

    const firstWidth = first.width();
    const lastWidth = last.width();

    const w = Math.abs((lastLeft + (lastWidth / 2)) - (firstLeft + (firstWidth / 2)));
    const l = firstWidth / 2;

    setBranchWidth(w);
    setBranchLeft(l);
  }, [lastSubRef, firstSubRef, subordinates]);

  return (
    <div className="leaf" ref={leafRef}>
      <div className="label" style={labelStyle}>{ label }</div>
      { !!level && <div className="root" style={rootStyle} /> }
      { !!subordinates && !!subordinates.length && (
        <>
          <br />
          <div className="subordinates">
            <div className="root" style={rootStyle} />
            <div className="branch" style={branchStyle} />
            { subordinates.map((sub, i) => (
              <Leaf
                label={sub.name}
                subordinates={sub.subordinates}
                key={sub.id}
                level={level + 1}
                ref={selectRef(i)}
              />
            )) }
          </div>
        </>
      ) }
    </div>
  );
});

Leaf.propTypes = {
  label: PropTypes.string.isRequired,
  subordinates: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    subordinates: PropTypes.array
  })),
  level: PropTypes.number.isRequired
};

Leaf.defaultProps = {
  subordinates: []
};

export default Leaf;
