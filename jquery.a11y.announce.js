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
  a11y.announce = function(obj, loop, noRep) {
    var str = obj;

    // extract text if passed DOM Element Node
    if (str && str.nodeName && str.nodeType === 1) {
      str = $(str).text();
    }

    // push onto messages queue if not looping last message
    if (!loop) {
      a11y.announce.ext.alertMsgs.push(str);
    }

    // announce next message
    if ((a11y.announce.ext.alertMsgs.length === 1 || loop)) {
      // determine how much time to leave message in aria-live placeholder
      var timeLength = a11y.announce.defaultOptions.baseDelay + (a11y.announce.defaultOptions.iterate(a11y.announce.ext.alertMsgs[0],
        /\s|\,|\.|\:|\;|\!|\(|\)|\/|\?|\@|\#|\$|\%|\^|\&|\*|\\|\-|\_|\+|\=/g) * a11y.announce.defaultOptions.charMultiplier);

      if (!(noRep && a11y.announce.ext.lastMsg === a11y.announce.ext.alertMsgs[0])) {
        a11y.announce.ext.lastMsg = a11y.announce.ext.alertMsgs[0];
        a11y.announce.ext.placeHolder.innerHTML = a11y.announce.ext.alertMsgs[0]; // Must use innerHTML
      }

      a11y.announce.alertTimeOut = setTimeout(function(){
        a11y.announce.ext.placeHolder.innerHTML = '';
        a11y.announce.ext.alertMsgs.shift();

        if (a11y.announce.ext.alertMsgs.length >= 1) {
          a11y.announce(a11y.announce.ext.alertMsgs[0], true);
        }
      }, timeLength);
    }

    return obj;
  };

  a11y.announce.ext = {
    alertMsgs: [],
    lastMsg: ''
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
    if (!a11y.announce.ext.placeHolder) {
      a11y.announce.ext.placeHolder = $('<span></span>')
        .attr({ 'aria-live': 'polite', 'aria-atomic': 'false' })
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

        $('body').append(a11y.announce.ext.placeHolder);
    }
  });

})(jQuery, window, document);