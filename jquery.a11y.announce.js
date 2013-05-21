/**
 * Unobtrusive Announce Method, formed into a more syntax correct jQuery
 * plugin.
 * Code taking from Bryan Garaventa's (WhatSock.com) of the same name as
 * part of the AccDC library.

 */

;(function($, window, document, undefined) {
  // check to see if the a11y namespace already exists
  var a11y = window.a11y ? window.a11y : window.a11y = {};

  a11y.announce = function(obj, loop, noRep) {
    var str = obj;

    if (str && str.nodeName && str.nodeType === 1) {
      str = $(str).text();
    }

    if (!loop) {
      a11y.announce.ext.alertMsgs.push(str);
    }

    if ((a11y.announce.ext.alertMsgs.length === 1 || loop)) {
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