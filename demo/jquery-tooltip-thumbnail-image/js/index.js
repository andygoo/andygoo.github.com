var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Slider = function (_React$Component) {
  _inherits(Slider, _React$Component);

  function Slider() {
    _classCallCheck(this, Slider);

    var _this = _possibleConstructorReturn(this, (Slider.__proto__ || Object.getPrototypeOf(Slider)).call(this));

    _this.state = {
      activeIndex: 0,
      previousIndex: 0,
      previewIndex: 0,
      previewActive: false
    };
    return _this;
  }

  _createClass(Slider, [{
    key: 'handleActive',
    value: function handleActive(index) {
      var activeIndex = this.state.activeIndex;

      this.setState({
        activeIndex: index,
        previousIndex: activeIndex,
        previewActive: false
      });
    }
  }, {
    key: 'handlePreview',
    value: function handlePreview(index, offset, activate) {
      this.setState({
        previewOffset: offset,
        previewIndex: index,
        previewActive: activate
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          activeIndex = _state.activeIndex,
          previousIndex = _state.previousIndex,
          previewIndex = _state.previewIndex,
          previewOffset = _state.previewOffset,
          previewActive = _state.previewActive;
      var _props = this.props,
          slides = _props.slides,
          dotSettings = _props.dotSettings,
          animSettings = _props.animSettings;
      var preview = slides[previewIndex].preview;
      var current = slides[activeIndex].content;
      var previous = slides[previousIndex].content;


      return React.createElement(
        'div',
        { className: 'slides' },
        React.createElement(Slide, {
          current: current,
          previous: previous
        }),
        React.createElement(
          SlidePreview,
          _extends({}, animSettings, {
            contentAnimMultiplier: 1.65,
            gap: 5,
            active: previewActive,
            offset: previewOffset }),
          preview
        ),
        React.createElement(Navigator, _extends({}, dotSettings, animSettings, {
          num: slides.length,
          activeScale: 0.75,
          onPreviewChange: this.handlePreview.bind(this),
          onActiveChange: this.handleActive.bind(this)
        }))
      );
    }
  }]);

  return Slider;
}(React.Component);

var Slide = function (_React$Component2) {
  _inherits(Slide, _React$Component2);

  function Slide() {
    _classCallCheck(this, Slide);

    return _possibleConstructorReturn(this, (Slide.__proto__ || Object.getPrototypeOf(Slide)).apply(this, arguments));
  }

  _createClass(Slide, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {
      var current = this.props.current;

      this.setState({ current: current });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.state.current === this.props.current) return;

      var anim = this.anim,
          el = this.el;

      if (anim) stopAnimation(anim);

      // using anime's [start, finish] syntax for scale
      // and opacity was causing a weird stutter so we're
      // just manually setting the initial state here.
      el.style.transform = 'scale(0.85)';
      el.style.opacity = 0;
      this.anim = anime({
        targets: el,
        scale: 1,
        opacity: 1,
        duration: 250,
        easing: 'easeOutQuint'
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props2 = this.props,
          previous = _props2.previous,
          current = _props2.current;

      return React.createElement(
        'div',
        { className: 'slide-wrap' },
        React.createElement(
          'div',
          { className: 'slide' },
          React.createElement(
            'div',
            { className: 'slide__inner' },
            previous
          ),
          React.createElement(
            'div',
            { className: 'slide__inner slide__inner--active', ref: function ref(el) {
                _this3.el = el;
              } },
            current
          )
        )
      );
    }
  }]);

  return Slide;
}(React.Component);

var SlidePreview = function (_React$Component3) {
  _inherits(SlidePreview, _React$Component3);

  function SlidePreview() {
    _classCallCheck(this, SlidePreview);

    return _possibleConstructorReturn(this, (SlidePreview.__proto__ || Object.getPrototypeOf(SlidePreview)).apply(this, arguments));
  }

  _createClass(SlidePreview, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var _props3 = this.props,
          offset = _props3.offset,
          animElasticity = _props3.animElasticity,
          animDuration = _props3.animDuration,
          contentAnimMultiplier = _props3.contentAnimMultiplier;
      var xOff = offset.xOff,
          yOff = offset.yOff;
      var animations = this.animations,
          triangle = this.triangle,
          content = this.content;


      if (animations) stopAnimation(animations);
      this.setTopPosition(yOff);

      var contentOff = content.offsetWidth;
      var triangleOff = triangle.offsetWidth;

      var contentAnim = anime({
        targets: content,
        duration: animDuration * contentAnimMultiplier,
        elasticity: animElasticity * contentAnimMultiplier,
        translateX: this.clamp(xOff - contentOff / 2, contentOff)
      });

      var triangleAnim = anime({
        targets: triangle,
        translateX: xOff - triangleOff / 2,
        elasticity: animElasticity,
        duration: animDuration
      });

      this.animations = [contentAnim, triangleAnim];
    }
  }, {
    key: 'setTopPosition',
    value: function setTopPosition(yOff) {
      var gap = this.props.gap;
      var content = this.content,
          triangle = this.triangle;

      var triangleOff = triangle.offsetHeight;
      var contentOff = content.offsetHeight;
      var offset = yOff - gap;
      content.style.top = offset - contentOff - triangleOff + 'px';
      triangle.style.top = offset - triangleOff + 'px';
    }
  }, {
    key: 'clamp',
    value: function clamp(amount, offset) {
      var min = 0;
      var max = window.innerWidth - offset;
      // http://stackoverflow.com/a/11409978
      return Math.max(min, Math.min(amount, max));
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      var _props4 = this.props,
          children = _props4.children,
          active = _props4.active;

      var baseClass = 'slide__slide-preview';
      var activeClass = 'slide__slide-preview--active';
      var classes = active ? baseClass + ' ' + activeClass : baseClass;
      return React.createElement(
        'div',
        { className: classes },
        React.createElement('div', {
          className: 'slide-preview__content',
          ref: function ref(el) {
            _this5.content = el;
          },
          children: children
        }),
        React.createElement('div', {
          className: 'slide-preview__triangle',
          ref: function ref(el) {
            _this5.triangle = el;
          }
        })
      );
    }
  }]);

  return SlidePreview;
}(React.Component);

var Navigator = function (_React$Component4) {
  _inherits(Navigator, _React$Component4);

  function Navigator() {
    _classCallCheck(this, Navigator);

    var _this6 = _possibleConstructorReturn(this, (Navigator.__proto__ || Object.getPrototypeOf(Navigator)).call(this));

    _this6.state = {
      start: 0,
      snapped: 0,
      index: 0,
      listeners: _this6.buildListeners()
    };
    return _this6;
  }

  _createClass(Navigator, [{
    key: 'buildListeners',
    value: function buildListeners() {
      var _this7 = this;

      return {
        mousemove: function mousemove(e) {
          e.preventDefault();
          _this7.drag(e);
        },
        touchmove: function touchmove(e) {
          e.preventDefault();
          e = e.touches[0];
          _this7.drag(e);
        },
        mouseup: function mouseup() {
          _this7.stopDrag();
        },
        touchend: function touchend() {
          _this7.stopDrag();
        }
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props5 = this.props,
          size = _props5.size,
          gap = _props5.gap,
          num = _props5.num;

      var snaps = [];
      for (var i = 0; i < num; i++) {
        snaps.push(i * (size + gap));
      }
      this.setState({ snaps: snaps });
      this.handlePreviewIndex(snaps, snaps[0], false);
    }
  }, {
    key: 'addDragListeners',
    value: function addDragListeners() {
      var listeners = this.state.listeners;

      for (var listener in listeners) {
        window.addEventListener(listener, listeners[listener]);
      }
    }
  }, {
    key: 'removeDragListeners',
    value: function removeDragListeners() {
      var listeners = this.state.listeners;

      for (var listener in listeners) {
        window.removeEventListener(listener, listeners[listener]);
      }
    }
  }, {
    key: 'startDrag',
    value: function startDrag(e) {
      var activeScale = this.props.activeScale;
      var _state2 = this.state,
          snapped = _state2.snapped,
          snaps = _state2.snaps;

      this.handlePreviewIndex(snaps, snapped);
      this.setState({ start: e.pageX - snapped });
      this.animate(snapped, activeScale);
      this.addDragListeners();
    }
  }, {
    key: 'drag',
    value: function drag(e) {
      var activeScale = this.props.activeScale;
      var _state3 = this.state,
          start = _state3.start,
          snaps = _state3.snaps;

      var actual = e.pageX - start;
      var snapped = this.snap(snaps, actual);

      if (snapped !== this.state.snapped) {
        this.animate(snapped, activeScale);
        this.handlePreviewIndex(snaps, snapped);
        this.setState({ snapped: snapped });
      }
    }
  }, {
    key: 'stopDrag',
    value: function stopDrag() {
      var _state4 = this.state,
          snapped = _state4.snapped,
          snaps = _state4.snaps;

      this.handleActiveIndex(snaps, snapped);
      this.animate(snapped, 1);
      this.removeDragListeners();
    }
  }, {
    key: 'handlePreviewIndex',
    value: function handlePreviewIndex(snaps, snapped) {
      var activate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var _props6 = this.props,
          onPreviewChange = _props6.onPreviewChange,
          size = _props6.size,
          gap = _props6.gap;
      var navEl = this.navEl;

      if (onPreviewChange) {
        var index = snaps.indexOf(snapped);

        var _navEl$getBoundingCli = navEl.getBoundingClientRect(),
            top = _navEl$getBoundingCli.top,
            left = _navEl$getBoundingCli.left;

        var dotOffset = size / 2 + gap;
        var offsets = {
          xOff: snapped + left + dotOffset,
          yOff: top + window.pageYOffset
        };
        onPreviewChange(index, offsets, activate);
      }
    }
  }, {
    key: 'handleActiveIndex',
    value: function handleActiveIndex(snaps, snapped) {
      var index = snaps.indexOf(snapped);
      var onActiveChange = this.props.onActiveChange;

      if (onActiveChange) {
        onActiveChange(index);
      }
    }
  }, {
    key: 'animate',
    value: function animate(translateX, scale) {
      var _props7 = this.props,
          animElasticity = _props7.animElasticity,
          animDuration = _props7.animDuration;
      var anim = this.anim;

      if (anim) stopAnimation(anim);
      this.anim = anime({
        targets: this.current.el,
        translateX: translateX,
        scale: scale,
        elasticity: animElasticity,
        duration: animDuration
      });
    }
  }, {
    key: 'snap',
    value: function snap(arr, num) {
      arr = [].concat(_toConsumableArray(arr)); // copy to avoid mutating params
      var diffOne = Math.abs(arr[0] - num);
      var diffTwo = Math.abs(arr[1] - num);
      return diffOne < diffTwo || arr.length === 1 ? arr[0] : this.snap(arr.slice(1), num);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this8 = this;

      var _props8 = this.props,
          num = _props8.num,
          size = _props8.size,
          gap = _props8.gap;

      var dots = [];

      dots.push(React.createElement(NavDot, {
        className: 'slide-nav__current',
        ref: function ref(current) {
          _this8.current = current;
        },
        size: size
      }));

      for (var i = 0; i < num; i++) {
        var margin = i !== num - 1 ? gap : 0;
        dots.push(React.createElement(NavDot, {
          className: 'slide-nav__indicator',
          size: size,
          margin: margin
        }));
      }

      return React.createElement(
        'div',
        { className: 'slide-nav-wrap' },
        React.createElement('div', {
          className: 'slide-nav',
          ref: function ref(el) {
            _this8.navEl = el;
          },
          children: dots,
          onMouseDown: this.startDrag.bind(this),
          onTouchStart: function onTouchStart(e) {
            e.preventDefault();
            _this8.startDrag(e.touches[0]);
          } })
      );
    }
  }]);

  return Navigator;
}(React.Component);

var NavDot = function (_React$Component5) {
  _inherits(NavDot, _React$Component5);

  function NavDot() {
    _classCallCheck(this, NavDot);

    return _possibleConstructorReturn(this, (NavDot.__proto__ || Object.getPrototypeOf(NavDot)).apply(this, arguments));
  }

  _createClass(NavDot, [{
    key: 'render',
    value: function render() {
      var _this10 = this;

      var _props9 = this.props,
          size = _props9.size,
          _props9$margin = _props9.margin,
          margin = _props9$margin === undefined ? 0 : _props9$margin;


      var styles = {
        height: size + 'px',
        width: size + 'px',
        marginRight: margin + 'px'
      };

      return React.createElement('div', {
        ref: function ref(el) {
          _this10.el = el;
        },
        className: this.props.className,
        style: styles
      });
    }
  }]);

  return NavDot;
}(React.Component);

var stopAnimation = function stopAnimation(animations) {
  /*
   This used to just pause any remaining animation
   but anime gets stuck sometimes when an animation
   is trying to tween values approaching 0.
    Basically to avoid that we're just forcing near-finished
   animations to jump to the end.
    This is definitely a hack but it gets the job done—
   if the root cause can be determined it would be good
   to revisit.
   */
  var stop = function stop(anim) {
    var duration = anim.duration,
        remaining = anim.remaining;

    if (remaining === 1) anim.seek(duration);else anim.pause();
  };
  if (Array.isArray(animations)) animations.forEach(function (anim) {
    return stop(anim);
  });else stop(animations);
};

var App = function (_React$Component6) {
  _inherits(App, _React$Component6);

  function App() {
    _classCallCheck(this, App);

    var _this11 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

    _this11.state = {
      images: ['images/slide-1.jpg', 'images/slide-2.jpg', 'images/slide-3.jpg', 'images/slide-4.jpg', 'images/slide-5.jpg']
    };
    _this11.state.images.forEach(function (image) {
      var preload = new Image();
      preload.src = image;
    });
    return _this11;
  }

  _createClass(App, [{
    key: 'render',
    value: function render() {
      var images = this.state.images;

      var slides = images.map(function (image) {
        return {
          content: React.createElement('img', { src: image }),
          preview: React.createElement('img', { src: image })
        };
      });
      return React.createElement(
        'div',
        null,
        React.createElement(Slider, {
          slides: slides,
          animSettings: { animDuration: 500, animElasticity: 200 },
          dotSettings: { size: 12, gap: 6 } })
      );
    }
  }]);

  return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));