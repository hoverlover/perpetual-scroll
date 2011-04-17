(function($) {

  $.fn.perpetualScroll = function (options) {
    var options = $.extend({
      triggerMargin: 30,
      resultSelector: '.result'
    }, options);

    return this.each(function() {
      var $this = $(this);
      var data = $this.data('perpetualScroll');
      if (!data) {
        data = { triggered: false, hasMoreResults: true };
      }

      $this.scroll(function() {
        var triggerPos = this.scrollHeight - options.triggerMargin;
        var currentPos = this.scrollTop + $(this).height();

        if (currentPos > triggerPos && !data.triggered && data.hasMoreResults) {
          data.triggered = true;

          var href = window.location.href + '?result_count=' + $this.find(options.resultSelector).size();
          $.get(href, function(html, textStatus, xhr) {
            data.triggered = false;

            if (html.trim() != '') {
              $this.append(html);
            } else {
              data.hasMoreResults = false;
            }
          });
        }
      });
    });
  };
}) ( jQuery );
