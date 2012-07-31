/*!
 * jquery-perpetual-scroll JavaScript Library v0.2.3
 * https://github.com/hoverlover/perpetual-scroll
 *
 * Copyright 2011, Chad Boyd
 * Licensed under the MIT license.
 */
(function($) {

 /*
  * Options that can be passed in are:
  *
  * appendTo:         This is the element to which to append the results from
  *                   the Ajax call. Defaults to $(this).
  *
  * beforeSend:       A pre-request callback function. Use this to show a
  *                   status indicator, for example.
  *
  * complete:         A function to be called when the request finishes, regardless
  *                   of the return status code.
  *
  * data:             This can either be a function or the raw data to be sent to the
  *                   server. If a function, it must return the data in the form of a
  *                   url-encoded string or a Javascript object.
  *
  * moreResultsCheck: Callback function that will be used to notify perpetual-scroll
  *                   if more results can be retrieved from the server.  This is
  *                   used by perpetual-scroll to determined whether or not to request
  *                   more results when the scroll bar reaches the bottom the next time.
  *                   Must return either true or false.
  *
  * resultSelector:   This can be any valid CSS selector that is used to identify an
  *                   element that wraps an individual result. Defaults to .result.
  *
  * triggerMargin:    This is the number of pixels from the bottom of the scrollable
  *                   results element where the Ajax request will be triggered.
  *                   Defaults to 30. Set it higher to make the request farther away
  *                   from the bottom of the results list.
  *
  * type:             The type of request to make ("POST" or "GET"), default is "GET".
  *                   Note: Other HTTP request methods, such as PUT and DELETE, can also
  *                   be used here, but they are not supported by all browsers.
  *
  * url:              This is the url to use in the request. It can include a query string.
  *                   perpetual-scroll is smart enough to deal with them. Defaults to
  *                   window.location.href.
  */
  $.fn.perpetualScroll = function (options) {

    var options = $.extend({
      triggerMargin: 30,
      resultSelector: '.result',
      appendTo: $(this),
      url: window.location.href.split('#')[0],
      type: 'GET'
    }, options);

    return this.each(function() {

     /*
      * Data that perpetual-scroll stores on the element.
      *
      * hasMoreResults: This value is set from the return value of the moreResultsCheck function.
      *                 It can also be set manually outside of perpetual-scroll if another process
      *                 updates the results and wants to update perpetual-scroll.  Must be set to
      *                 either true of false.
      *
      * triggered:      This is what perpetual-scroll uses to keep track of whether a request is currently
      *                 processing.  This property is not meant to be used outside of perpetual-scroll.
      *
      * disabled:       This property is useful if perpetual-scroll needs to be temporarily disabled.
      *                 For example, if another function needs to scroll the element, but doesn't want
      *                 to trigger perpetual-scroll and doesn't want to unbind it.
      */
      $(this).data('perpetualScroll', {
        hasMoreResults: true,
        triggered: false,
        disabled: false
      });

      var data = $(this).data('perpetualScroll');

      $(this).scroll(function() {
        // Point in the scroll where the request should be triggered.
        var triggerPos = this.scrollHeight - options.triggerMargin;
        var currentPos = this.scrollTop + $(this).height();

        if (currentPos > triggerPos
            && !data.triggered
            && data.hasMoreResults
            && !data.disabled) {

          data.triggered = true;

          var href = options.url
          if (href.indexOf('?') > -1) {
            href += '&';
          } else {
            href += '?';
          }

          href += 'result_count=' + $(this).find(options.resultSelector).size();
          $.ajax({
            url: href,
            type: options.type,
            dataType: 'html',
            beforeSend: options.beforeSend,
            success: function(html, textStatus, xhr) {
              $(options.appendTo).append(html);

              if ($.isFunction(options.moreResultsCheck)) {
                data.hasMoreResults = options.moreResultsCheck.call(this, xhr);
              } else {
                data.hasMoreResults = $.trim(html) != '';
              }
            },
            complete: function() {
              data.triggered = false;
              if ($.isFunction(options.complete)) {
                options.complete.call();
              }
            },
            data: $.isFunction(options.data) ? options.data.call() : options.data
          });
        }
      });
    });
  };
}) ( jQuery );
