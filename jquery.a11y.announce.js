/**
 * Unobtrusive Announce Method, formed into a more syntax correct jQuery
 * plugin.
 * Code taken from Bryan Garaventa's (WhatSock.com) of the same name, as
 * part of the AccDC library he developed.
 * 
 * Author: @marshallbu
 *
 */

;(function($, window, document, undefined) {
  // check to see if the a11y namespace already exists, then create or
  // extend it
  var a11y = window.a11y ? window.a11y : window.a11y = {};

  // announce function, that will take in either a string or a DOM Element
  // Node and announce it's text
  // take in an 'options' object with properties message, loop, noRep
  // message can be a string or a DOM Element Node
  a11y.announce = function(opts) {
    var self = this;
    console.log(self);
    var options = opts || {};
    options.type = opts.type || 'polite';

    //TODO: make it optional to just pass in a string instead of an options object

    var obj = options.message;
    var loop = options.loop;
    var noRep = options.noRep;

    var str = obj;

    // extract text if passed DOM Element Node
    if (str && str.nodeName && str.nodeType === 1) {
      str = $(str).text();
    }

    // push onto messages queue if not looping last message
    if (!loop) {
      a11y.announce.queues[options.type].alertMsgs.push(str);
    }

    // announce next message
    if (options.type === 'polite' && (a11y.announce.queues[options.type].alertMsgs.length === 1 || loop) ) {
      // determine how much time to leave message in aria-live placeholder
      var timeLength = a11y.announce.defaultOptions.baseDelay + (a11y.announce.defaultOptions.iterate(a11y.announce.queues[options.type].alertMsgs[0],
        /\s|\,|\.|\:|\;|\!|\(|\)|\/|\?|\@|\#|\$|\%|\^|\&|\*|\\|\-|\_|\+|\=/g) * a11y.announce.defaultOptions.charMultiplier);

      if (!(noRep && a11y.announce.queues[options.type].lastMsg === a11y.announce.queues[options.type].alertMsgs[0])) {
        a11y.announce.queues[options.type].lastMsg = a11y.announce.queues[options.type].alertMsgs[0];
        a11y.announce.placeHolder[options.type].innerHTML = a11y.announce.queues[options.type].alertMsgs[0]; // Must use innerHTML
      }

      a11y.announce.alertTimeOut = setTimeout(function(){
        a11y.announce.placeHolder[options.type].innerHTML = '';
        a11y.announce.queues[options.type].alertMsgs.shift();

        if (a11y.announce.queues[options.type].alertMsgs.length >= 1) {
          a11y.announce({'message': a11y.announce.queues[options.type].alertMsgs[0], 'loop': true, 'type': options.type});
        }
      }, timeLength);
    } else {
      // since assertive means DO IT NOW and interrupt, just stuff it in
      // the assertive placeHolder
      

      a11y.announce.placeHolder[options.type].innerHTML = str;
    }



    return obj;
  };

  a11y.announce.queues = {
    'polite': {
      alertMsgs: [],
      lastMsg: ''
    },
    'assertive': {
      alertMsgs: [],
      lastMsg: ''
    }
  };

  a11y.announce.defaultOptions = {
    baseDelay: 5000,
    charMultiplier: 10,
    iterate: function(str, regExp) {
      var iCount = 0;
      str.replace(regExp, function() {
        iCount++;
      });
      return iCount;
    }
  };

  // TODO: allow for option controls?
  // a11y.announce.setOptions = function(options) {
  //   a11y.announce.options = $.extend({}, a11y.announce.defaultOptions, options);
  // };

  $(function () {
    a11y.announce.placeHolder = a11y.announce.placeHolder || {};

    a11y.announce.placeHolder.polite = function () {
      var element = a11y.announce.placeHolder.polite;

      if (typeof element === 'undefined') {
        element = $('<span></span>')
          .attr({ 'role': 'region', 'aria-live': 'polite', 'aria-atomic': 'false' })
          .css({
            position: 'absolute',
            clip: 'rect(1px, 1px, 1px, 1px)',
            padding: 0,
            border: 0,
            height: '1px',
            width: '1px',
            overflow: 'hidden',
            zIndex: -1000
          }).get(0);

        $('body').append(element);
        return element;
      }
      return element;
    }();

    a11y.announce.placeHolder.assertive = function () {
      var element = a11y.announce.placeHolder.assertive;

      if (typeof element === 'undefined') {
        element = $('<span></span>')
          .attr({ 'role': 'alert', 'aria-live': 'assertive', 'aria-atomic': 'false' })
          .css({
            position: 'absolute',
            clip: 'rect(1px, 1px, 1px, 1px)',
            padding: 0,
            border: 0,
            height: '1px',
            width: '1px',
            overflow: 'hidden',
            zIndex: -1000
          }).get(0);

        $('body').append(element);
        return element;
      }
      return element;
    }();


  });

})(jQuery, window, document);