(function($) {

  $.fn.perpetualScroll = function (options) {
    var options = $.extend({
      triggerMargin: 30,
      resultSelector: '.result',
      appendTo: $(this),
      url: window.location.href,
      type: 'GET'
    }, options);

    return this.each(function() {
      var data = $(this).data('perpetualScroll');
      if (!data) {
        data = { triggered: false, hasMoreResults: true };
      }

      $(this).scroll(function() {
        var triggerPos = this.scrollHeight - options.triggerMargin;
        var currentPos = this.scrollTop + $(this).height();

        if (currentPos > triggerPos && !data.triggered && data.hasMoreResults) {
          data.triggered = true;

          var href = options.url
          if (href.indexOf('?') > -1)
            href += '&';
          else
            href += '?';

          href += 'result_count=' + $(this).find(options.resultSelector).size();
          $.ajax({
            url: href,
            type: options.type,
            beforeSend: options.beforeSend,
            success: function(html, textStatus, xhr) {
              data.triggered = false;

              if (html.trim() != '') {
                $(options.appendTo).append(html);
              } else {
                data.hasMoreResults = false;
              }
            },
            complete: options.complete,
            data: options.data
          });
        }
      });
    });
  };
}) ( jQuery );


