import React, { forwardRef, useRef, useLayoutEffect, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import $ from 'jquery';
import classNames from 'classnames';
import { TweenMax } from 'gsap';
import { Draggable } from 'gsap/all';
import composeRefs from '@seznam/compose-react-refs';

import { levelColors } from 'consts';
import appActions from 'AppActions';

import './Leaf.scss';

const Leaf = forwardRef(({ id, label, subordinates, level }, outerRef) => {
  const firstSubRef = useRef(null);
  const lastSubRef = useRef(null);
  const leafRef = useRef(null);
  const labelRef = useRef(null);

  const [branchWidth, setBranchWidth] = useState();
  const [branchLeft, setBranchLeft] = useState();
  const [targetted, setTargetted] = useState(false);

  const dispatch = useDispatch();
  const { endCoords, attaching } = useSelector((state) => state.app);

  const labelClass = classNames({
    label: true,
    targetted
  });

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

  /* eslint-disable react/no-this-in-sfc */
  const makeDraggable = (e) => {
    if (!leafRef || !leafRef.current) return;

    const t = Draggable.create(leafRef.current, {
      type: 'x,y',
      onDragEnd() {
        this.kill();
        dispatch(appActions.setEndCoords({
          x: this.pointerX,
          y: this.pointerY
        }));

        if (!labelRef || !labelRef.current) return;
        labelRef.current.focus();
      }
    });

    if (t && t.length) {
      t[0].startDrag(e);
    }

    dispatch(appActions.setTarget(id));

    setTargetted(true);
  };
  /* eslint-enable */

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

  useEffect(() => {
    if (!leafRef || !leafRef.current) return;
    if (!endCoords) return;

    const { x, y } = endCoords;
    const { top, left, width, height } = leafRef.current.getBoundingClientRect();

    if (
      (x < left)
      || (x > left + width)
      || (y < top)
      || (y > top + height)
    ) {
      return;
    }

    dispatch(appActions.attach(id));
  }, [endCoords, id, dispatch, attaching]);

  useEffect(() => {
    if (!leafRef || !leafRef.current) return;

    TweenMax.set(leafRef.current, {
      transform: 'none',
      zIndex: 'initial'
    });
  }, [leafRef]);

  return (
    <div className="leaf" ref={composeRefs(leafRef, outerRef)}>
      <div
        ref={labelRef}
        className={labelClass}
        role="button"
        tabIndex={0}
        style={labelStyle}
        onBlur={() => setTargetted(false)}
        onMouseDown={(e) => makeDraggable(e)}
      >
        { label }
      </div>
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
                id={sub.id}
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
  level: PropTypes.number.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};

Leaf.defaultProps = {
  subordinates: []
};

export default Leaf;
