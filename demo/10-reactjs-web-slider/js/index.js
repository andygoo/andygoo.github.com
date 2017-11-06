'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _React = React;
var Component = _React.Component;
var PropTypes = _React.PropTypes;
var _ReactNative = ReactNative;
var Animated = _ReactNative.Animated;
var AppRegistry = _ReactNative.AppRegistry;
var Easing = _ReactNative.Easing;
var PanResponder = _ReactNative.PanResponder;
var StyleSheet = _ReactNative.StyleSheet;
var Text = _ReactNative.Text;
var ScrollView = _ReactNative.ScrollView;
var View = _ReactNative.View;

var TRACK_SIZE = 4;
var THUMB_SIZE = 20;

function Rect(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

Rect.prototype.containsPoint = function (x, y) {
  return x >= this.x && y >= this.y && x <= this.x + this.width && y <= this.y + this.height;
};

var DEFAULT_ANIMATION_CONFIGS = {
  spring: {
    friction: 7,
    tension: 100
  },
  timing: {
    duration: 150,
    easing: Easing.inOut(Easing.ease),
    delay: 0
  }
};

var Slider = React.createClass({
  displayName: 'Slider',

  propTypes: {
    /**
     * Initial value of the slider. The value should be between minimumValue
     * and maximumValue, which default to 0 and 1 respectively.
     * Default value is 0.
     *
     * *This is not a controlled component*, e.g. if you don't update
     * the value, the component won't be reset to its inital value.
     */
    value: PropTypes.number,

    /**
     * If true the user won't be able to move the slider.
     * Default value is false.
     */
    disabled: PropTypes.bool,

    /**
     * Initial minimum value of the slider. Default value is 0.
     */
    minimumValue: PropTypes.number,

    /**
     * Initial maximum value of the slider. Default value is 1.
     */
    maximumValue: PropTypes.number,

    /**
     * Step value of the slider. The value should be between 0 and
     * (maximumValue - minimumValue). Default value is 0.
     */
    step: PropTypes.number,

    /**
     * The color used for the track to the left of the button. Overrides the
     * default blue gradient image.
     */
    minimumTrackTintColor: PropTypes.string,

    /**
     * The color used for the track to the right of the button. Overrides the
     * default blue gradient image.
     */
    maximumTrackTintColor: PropTypes.string,

    /**
     * The color used for the thumb.
     */
    thumbTintColor: PropTypes.string,

    /**
     * The size of the touch area that allows moving the thumb.
     * The touch area has the same center has the visible thumb.
     * This allows to have a visually small thumb while still allowing the user
     * to move it easily.
     * The default is {width: 40, height: 40}.
     */
    thumbTouchSize: PropTypes.shape({ width: PropTypes.number, height: PropTypes.number }),

    /**
     * Callback continuously called while the user is dragging the slider.
     */
    onValueChange: PropTypes.func,

    /**
     * Callback called when the user starts changing the value (e.g. when
     * the slider is pressed).
     */
    onSlidingStart: PropTypes.func,

    /**
     * Callback called when the user finishes changing the value (e.g. when
     * the slider is released).
     */
    onSlidingComplete: PropTypes.func,

    /**
     * The style applied to the slider container.
     */
    style: View.propTypes.style,

    /**
     * The style applied to the track.
     */
    trackStyle: View.propTypes.style,

    /**
     * The style applied to the thumb.
     */
    thumbStyle: View.propTypes.style,

    /**
     * Set this to true to visually see the thumb touch rect in green.
     */
    debugTouchArea: PropTypes.bool,

    /**
    * Set to true to animate values with default 'timing' animation type
    */
    animateTransitions: PropTypes.bool,

    /**
    * Custom Animation type. 'spring' or 'timing'.
    */
    animationType: PropTypes.oneOf(['spring', 'timing']),

    /**
    * Used to configure the animation parameters.  These are the same parameters in the Animated library.
    */
    animationConfig: PropTypes.object
  },
  getInitialState: function getInitialState() {
    return {
      containerSize: { width: 0, height: 0 },
      trackSize: { width: 0, height: 0 },
      thumbSize: { width: 0, height: 0 },
      allMeasured: false,
      value: new Animated.Value(this.props.value)
    };
  },
  getDefaultProps: function getDefaultProps() {
    return {
      value: 0,
      minimumValue: 0,
      maximumValue: 1,
      step: 0,
      minimumTrackTintColor: '#3f3f3f',
      maximumTrackTintColor: '#b3b3b3',
      thumbTintColor: '#343434',
      thumbTouchSize: { width: 40, height: 40 },
      debugTouchArea: false,
      animationType: 'timing'
    };
  },
  componentWillMount: function componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminationRequest: this._handlePanResponderRequestEnd,
      onPanResponderTerminate: this._handlePanResponderEnd
    });
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var newValue = nextProps.value;

    if (this.props.value !== newValue) {
      if (this.props.animateTransitions) {
        this._setCurrentValueAnimated(newValue);
      } else {
        this._setCurrentValue(newValue);
      }
    }
  },
  /*
  shouldComponentUpdate: function(nextProps, nextState) {
    // We don't want to re-render in the following cases:
    // - when only the 'value' prop changes as it's already handled with the Animated.Value
    // - when the event handlers change (rendering doesn't depend on them)
    // - when the style props haven't actually change
     return shallowCompare(
      { props: this._getPropsForComponentUpdate(this.props), state: this.state },
      this._getPropsForComponentUpdate(nextProps),
      nextState
    ) || !styleEqual(this.props.style, nextProps.style)
      || !styleEqual(this.props.trackStyle, nextProps.trackStyle)
      || !styleEqual(this.props.thumbStyle, nextProps.thumbStyle);
  },
  */
  render: function render() {
    var _props = this.props;
    var minimumValue = _props.minimumValue;
    var maximumValue = _props.maximumValue;
    var minimumTrackTintColor = _props.minimumTrackTintColor;
    var maximumTrackTintColor = _props.maximumTrackTintColor;
    var thumbTintColor = _props.thumbTintColor;
    var styles = _props.styles;
    var style = _props.style;
    var trackStyle = _props.trackStyle;
    var thumbStyle = _props.thumbStyle;
    var debugTouchArea = _props.debugTouchArea;

    var other = _objectWithoutProperties(_props, ['minimumValue', 'maximumValue', 'minimumTrackTintColor', 'maximumTrackTintColor', 'thumbTintColor', 'styles', 'style', 'trackStyle', 'thumbStyle', 'debugTouchArea']);

    var _state = this.state;
    var value = _state.value;
    var containerSize = _state.containerSize;
    var trackSize = _state.trackSize;
    var thumbSize = _state.thumbSize;
    var allMeasured = _state.allMeasured;

    var mainStyles = styles || defaultStyles;
    var thumbLeft = value.interpolate({
      inputRange: [minimumValue, maximumValue],
      outputRange: [0, containerSize.width - thumbSize.width]
    });
    //extrapolate: 'clamp',
    var valueVisibleStyle = {};
    if (!allMeasured) {
      valueVisibleStyle.opacity = 0;
    }

    var minimumTrackStyle = _extends({
      position: 'absolute',
      width: Animated.add(thumbLeft, thumbSize.width / 2),
      backgroundColor: minimumTrackTintColor
    }, valueVisibleStyle);

    var touchOverflowStyle = this._getTouchOverflowStyle();

    return React.createElement(
      View,
      _extends({}, other, { style: [mainStyles.container, style], onLayout: this._measureContainer }),
      React.createElement(View, {
        style: [{ backgroundColor: maximumTrackTintColor }, mainStyles.track, trackStyle],
        onLayout: this._measureTrack }),
      React.createElement(Animated.View, { style: [mainStyles.track, trackStyle, minimumTrackStyle] }),
      React.createElement(Animated.View, {
        onLayout: this._measureThumb,
        style: [{ backgroundColor: thumbTintColor }, mainStyles.thumb, thumbStyle, _extends({ left: thumbLeft }, valueVisibleStyle)]
      }),
      React.createElement(
        View,
        _extends({
          style: [defaultStyles.touchArea, touchOverflowStyle]
        }, this._panResponder.panHandlers),
        debugTouchArea === true && this._renderDebugThumbTouchRect(thumbLeft)
      )
    );
  },
  _getPropsForComponentUpdate: function _getPropsForComponentUpdate(props) {
    var value = props.value;
    var onValueChange = props.onValueChange;
    var onSlidingStart = props.onSlidingStart;
    var onSlidingComplete = props.onSlidingComplete;
    var style = props.style;
    var trackStyle = props.trackStyle;
    var thumbStyle = props.thumbStyle;

    var otherProps = _objectWithoutProperties(props, ['value', 'onValueChange', 'onSlidingStart', 'onSlidingComplete', 'style', 'trackStyle', 'thumbStyle']);

    return otherProps;
  },

  _handleStartShouldSetPanResponder: function _handleStartShouldSetPanResponder(e) {
    // Should we become active when the user presses down on the thumb?
    return this._thumbHitTest(e);
  },

  _handleMoveShouldSetPanResponder: function _handleMoveShouldSetPanResponder() {
    // Should we become active when the user moves a touch over the thumb?
    return false;
  },

  _handlePanResponderGrant: function _handlePanResponderGrant() /*e: Object, gestureState: Object*/{
    this._previousLeft = this._getThumbLeft(this._getCurrentValue());
    this._fireChangeEvent('onSlidingStart');
  },
  _handlePanResponderMove: function _handlePanResponderMove(e, gestureState) {
    if (this.props.disabled) {
      return;
    }

    this._setCurrentValue(this._getValue(gestureState));
    this._fireChangeEvent('onValueChange');
  },
  _handlePanResponderRequestEnd: function _handlePanResponderRequestEnd(e, gestureState) {
    // Should we allow another component to take over this pan?
    return false;
  },
  _handlePanResponderEnd: function _handlePanResponderEnd(e, gestureState) {
    if (this.props.disabled) {
      return;
    }

    this._setCurrentValue(this._getValue(gestureState));
    this._fireChangeEvent('onSlidingComplete');
  },

  _measureContainer: function _measureContainer(x) {
    this._handleMeasure('containerSize', x);
  },
  _measureTrack: function _measureTrack(x) {
    this._handleMeasure('trackSize', x);
  },
  _measureThumb: function _measureThumb(x) {
    this._handleMeasure('thumbSize', x);
  },
  _handleMeasure: function _handleMeasure(name, x) {
    var _x$nativeEvent$layout = x.nativeEvent.layout;
    var width = _x$nativeEvent$layout.width;
    var height = _x$nativeEvent$layout.height;

    var size = { width: width, height: height };

    var storeName = '_' + name;
    var currentSize = this[storeName];
    if (currentSize && width === currentSize.width && height === currentSize.height) {
      return;
    }
    this[storeName] = size;

    if (this._containerSize && this._trackSize && this._thumbSize) {
      this.setState({
        containerSize: this._containerSize,
        trackSize: this._trackSize,
        thumbSize: this._thumbSize,
        allMeasured: true
      });
    }
  },
  _getRatio: function _getRatio(value) {
    return (value - this.props.minimumValue) / (this.props.maximumValue - this.props.minimumValue);
  },
  _getThumbLeft: function _getThumbLeft(value) {
    var ratio = this._getRatio(value);
    return ratio * (this.state.containerSize.width - this.state.thumbSize.width);
  },
  _getValue: function _getValue(gestureState) {
    var length = this.state.containerSize.width - this.state.thumbSize.width;
    var thumbLeft = this._previousLeft + gestureState.dx;

    var ratio = thumbLeft / length;

    if (this.props.step) {
      return Math.max(this.props.minimumValue, Math.min(this.props.maximumValue, this.props.minimumValue + Math.round(ratio * (this.props.maximumValue - this.props.minimumValue) / this.props.step) * this.props.step));
    } else {
      return Math.max(this.props.minimumValue, Math.min(this.props.maximumValue, ratio * (this.props.maximumValue - this.props.minimumValue) + this.props.minimumValue));
    }
  },
  _getCurrentValue: function _getCurrentValue() {
    return this.state.value.__getValue();
  },
  _setCurrentValue: function _setCurrentValue(value) {
    this.state.value.setValue(value);
  },
  _setCurrentValueAnimated: function _setCurrentValueAnimated(value) {
    var animationType = this.props.animationType;
    var animationConfig = Object.assign({}, DEFAULT_ANIMATION_CONFIGS[animationType], this.props.animationConfig, { toValue: value });

    Animated[animationType](this.state.value, animationConfig).start();
  },
  _fireChangeEvent: function _fireChangeEvent(event) {
    if (this.props[event]) {
      this.props[event](this._getCurrentValue());
    }
  },
  _getTouchOverflowSize: function _getTouchOverflowSize() {
    var state = this.state;
    var props = this.props;

    var size = {};
    if (state.allMeasured === true) {
      size.width = Math.max(0, props.thumbTouchSize.width - state.thumbSize.width);
      size.height = Math.max(0, props.thumbTouchSize.height - state.containerSize.height);
    }

    return size;
  },
  _getTouchOverflowStyle: function _getTouchOverflowStyle() {
    var _getTouchOverflowSize2 = this._getTouchOverflowSize();

    var width = _getTouchOverflowSize2.width;
    var height = _getTouchOverflowSize2.height;

    var touchOverflowStyle = {};
    if (width !== undefined && height !== undefined) {
      var verticalMargin = -height / 2;
      touchOverflowStyle.marginTop = verticalMargin;
      touchOverflowStyle.marginBottom = verticalMargin;

      var horizontalMargin = -width / 2;
      touchOverflowStyle.marginLeft = horizontalMargin;
      touchOverflowStyle.marginRight = horizontalMargin;
    }

    if (this.props.debugTouchArea === true) {
      touchOverflowStyle.backgroundColor = 'orange';
      touchOverflowStyle.opacity = 0.5;
    }

    return touchOverflowStyle;
  },
  _thumbHitTest: function _thumbHitTest(e) {
    var nativeEvent = e.nativeEvent;
    var thumbTouchRect = this._getThumbTouchRect();
    return thumbTouchRect.containsPoint(nativeEvent.locationX, nativeEvent.locationY);
  },
  _getThumbTouchRect: function _getThumbTouchRect() {
    var state = this.state;
    var props = this.props;
    var touchOverflowSize = this._getTouchOverflowSize();

    return new Rect(touchOverflowSize.width / 2 + this._getThumbLeft(this._getCurrentValue()) + (state.thumbSize.width - props.thumbTouchSize.width) / 2, touchOverflowSize.height / 2 + (state.containerSize.height - props.thumbTouchSize.height) / 2, props.thumbTouchSize.width, props.thumbTouchSize.height);
  },
  _renderDebugThumbTouchRect: function _renderDebugThumbTouchRect(thumbLeft) {
    var thumbTouchRect = this._getThumbTouchRect();
    var positionStyle = {
      left: thumbLeft,
      top: thumbTouchRect.y,
      width: thumbTouchRect.width,
      height: thumbTouchRect.height
    };

    return React.createElement(Animated.View, {
      style: [defaultStyles.debugThumbTouchArea, positionStyle],
      pointerEvents: 'none'
    });
  }
});

var defaultStyles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center'
  },
  track: {
    height: TRACK_SIZE,
    borderRadius: TRACK_SIZE / 2
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2
  },
  touchArea: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  debugThumbTouchArea: {
    position: 'absolute',
    backgroundColor: 'green',
    opacity: 0.5
  }
});

var DEFAULT_VALUE = 0.2;

var SliderContainer = React.createClass({
  displayName: 'SliderContainer',
  getInitialState: function getInitialState() {
    return {
      value: DEFAULT_VALUE
    };
  },
  render: function render() {
    var value = this.state.value;

    return React.createElement(
      View,
      null,
      React.createElement(
        View,
        { style: styles.titleContainer },
        React.createElement(
          Text,
          { style: styles.caption, numberOfLines: 1 },
          this.props.caption
        ),
        React.createElement(
          Text,
          { style: styles.value, numberOfLines: 1 },
          value
        )
      ),
      this._renderChildren()
    );
  },
  _renderChildren: function _renderChildren() {
    var _this = this;

    return React.Children.map(this.props.children, function (child) {
      if (child.type === Slider || child.type === ReactNative.Slider) {
        var value = _this.state.value;
        return React.cloneElement(child, {
          value: value,
          onValueChange: function onValueChange(val) {
            return _this.setState({ value: val });
          }
        });
      } else {
        return child;
      }
    });
  }
});

var SliderExample = React.createClass({
  displayName: 'SliderExample',
  getInitialState: function getInitialState() {
    return {
      //value: 0.2,
    };
  },
  render: function render() {
    return React.createElement(
      ScrollView,
      { contentContainerStyle: styles.container },
      React.createElement(
        Text,
        { style: { fontSize: '1.5em', marginBottom: 20 } },
        'react-native-sliders'
      ),
      React.createElement(
        SliderContainer,
        { caption: '<Slider/> with default style' },
        React.createElement(Slider, null)
      ),
      React.createElement(
        SliderContainer,
        { caption: '<Slider/> with min, max and custom tints ' },
        React.createElement(Slider, {
          minimumValue: -10,
          maximumValue: 42,
          minimumTrackTintColor: '#1fb28a',
          maximumTrackTintColor: '#d3d3d3',
          thumbTintColor: '#1a9274'
        })
      ),
      React.createElement(
        SliderContainer,
        { caption: '<Slider/> with custom style' },
        React.createElement(Slider, {
          trackStyle: iosStyles.track,
          thumbStyle: iosStyles.thumb,
          minimumTrackTintColor: '#1073ff',
          maximumTrackTintColor: '#b7b7b7'
        })
      ),
      React.createElement(
        SliderContainer,
        { caption: '<Slider/> with custom style #2' },
        React.createElement(Slider, {
          trackStyle: customStyles2.track,
          thumbStyle: customStyles2.thumb,
          minimumTrackTintColor: '#30a935'
        })
      ),
      React.createElement(
        SliderContainer,
        { caption: '<Slider/> with custom style #3' },
        React.createElement(Slider, {
          trackStyle: customStyles3.track,
          thumbStyle: customStyles3.thumb,
          minimumTrackTintColor: '#eecba8'
        })
      ),
      React.createElement(
        SliderContainer,
        { caption: '<Slider/> with custom style #4' },
        React.createElement(Slider, {
          trackStyle: customStyles4.track,
          thumbStyle: customStyles4.thumb,
          minimumTrackTintColor: '#d14ba6'
        })
      ),
      React.createElement(
        SliderContainer,
        { caption: '<Slider/> with custom style #5' },
        React.createElement(Slider, {
          trackStyle: customStyles5.track,
          thumbStyle: customStyles5.thumb,
          minimumTrackTintColor: '#ec4c46'
        })
      ),
      React.createElement(
        SliderContainer,
        { caption: '<Slider/> with custom style #6' },
        React.createElement(Slider, {
          trackStyle: customStyles6.track,
          thumbStyle: customStyles6.thumb,
          minimumTrackTintColor: '#e6a954'
        })
      ),
      React.createElement(
        SliderContainer,
        { caption: '<Slider/> with custom style #7' },
        React.createElement(Slider, {
          trackStyle: customStyles7.track,
          thumbStyle: customStyles7.thumb,
          minimumTrackTintColor: '#2f2f2f'
        })
      ),
      React.createElement(
        SliderContainer,
        { caption: '<Slider/> with custom style #8 and thumbTouchSize' },
        React.createElement(Slider, {
          style: customStyles8.container,
          trackStyle: customStyles8.track,
          thumbStyle: customStyles8.thumb,
          minimumTrackTintColor: '#31a4db',
          thumbTouchSize: { width: 50, height: 40 }
        })
      )
    );
  }
});

var styles = StyleSheet.create({
  container: {
    margin: 20,
    paddingBottom: 20,
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  caption: {
    //flex: 1,
  },
  value: {
    flex: 1,
    textAlign: 'right',
    marginLeft: 10
  }
});

var iosStyles = StyleSheet.create({
  track: {
    height: 2,
    borderRadius: 1
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: 'white'
  }
});

var customStyles2 = StyleSheet.create({
  track: {
    height: 4,
    borderRadius: 2
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: 'white',
    borderColor: '#30a935',
    borderWidth: 2
  }
});

var customStyles3 = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#d0d0d0'
  },
  thumb: {
    width: 10,
    height: 30,
    borderRadius: 5,
    backgroundColor: '#eb6e1b'
  }
});

var customStyles4 = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: 4,
    backgroundColor: 'white'

  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: '#f8a1d6',
    borderColor: '#a4126e',
    borderWidth: 5,
    borderRadius: 10

  }
});

var customStyles5 = StyleSheet.create({
  track: {
    height: 18,
    borderRadius: 1,
    backgroundColor: '#d5d8e8'
  },
  thumb: {
    width: 20,
    height: 30,
    borderRadius: 1,
    backgroundColor: '#838486'
  }
});

var customStyles6 = StyleSheet.create({
  track: {
    height: 14,
    borderRadius: 2,
    backgroundColor: 'white',
    borderColor: '#9a9a9a',
    borderWidth: 1
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 2,
    backgroundColor: '#eaeaea',
    borderColor: '#9a9a9a',
    borderWidth: 1
  }
});

var customStyles7 = StyleSheet.create({
  track: {
    height: 1,
    backgroundColor: '#303030'
  },
  thumb: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(150, 150, 150, 0.3)',
    borderColor: 'rgba(150, 150, 150, 0.6)',
    borderWidth: 14,
    borderRadius: 15
  }
});

var customStyles8 = StyleSheet.create({
  container: {
    height: 20
  },
  track: {
    height: 2,
    backgroundColor: '#303030'
  },
  thumb: {
    width: 10,
    height: 10,
    backgroundColor: '#31a4db',
    borderRadius: 10 / 2
  }
});

AppRegistry.registerComponent('Example', function () {
  return SliderExample;
});
AppRegistry.runApplication('Example', {
  rootTag: document.getElementById('react-root')
});