# Perpetual Scroll

This is a jQuery plugin that will facilitate the loading of additional
results by simply scrolling to the bottom of an element, in a perpetual
fashion.

## Example Usage

Below is an example of using Perpetual Scroll in a Rails app.

### Controller

    class UsersController < ApplicationController
      respond_to :html, :js
      @@result_set_size = 50

      def index
        offset = params[:result_count].try(:to_i) || 0
        @users = User.order('last_name asc').limit(@@result_set_size).offset(offset)

        if request.xhr?
          render @users, :layout => false and return
        end
      end
    end

### Views

app/views/users/index.html.haml:

    #results{:style => "height: 250px; overflow: auto"}
      = render @users

    :javascript
      $(function() {
        $('#results').perpetualScroll();
      });

app/views/users/_user.html.haml:

    .result
      = "#{user.first_name} #{user.last_name}"

## How it works

When a user scrolls near the bottom of the element containing the list of
results, the plugin will make an Ajax GET request to the current URL to
load more results.  A request parameter named `result_count` will be sent that
contains the current number of results on the page.  This is calculated
by counting the number of elements that match the `resultSelector`
option (defaults to `.result`).  You can then use this parameter in your
code to offset your results during subsequent loads.

Once there are no more results to be returned, an empty response should
be returned from the Ajax request.  This will alert the plugin that
there is no more data.

## Options

### `appendTo`

This is the element to which to append the results from the Ajax call.
Defaults to `$(this)`.

### `beforeSend`

A pre-request callback function.  Use this to show a status indicator,
for example.

### `complete`

A function to be called when the request finishes, regardless of the
return status code.

### `data`

This can either be a function or the raw data to be sent to the server.  If
a function, it must return the data in the form of a url-encoded string
or a Javascript object.

### `resultSelector`

This can be any valid CSS selector that is used to identify an element that wraps
an individual result.  Defaults to `.result`.

### `triggerMargin`

This is the number of pixels from the bottom of the scrollable results
element where the Ajax request will be triggered.  Defaults to 30.  Set
it higher to make the request farther away from the bottom of the
results list.

### `type`

The type of request to make ("POST" or "GET"), default is "GET".

**Note**: Other HTTP request methods, such as PUT and DELETE, can
also be used here, but they are not supported by all browsers.

### `url`

This is the url to use in the request.  It can include a query string.
perpetual-scroll is smart enough to deal with them.  Defaults to
`window.location.href`.


## TODO
* Add a callback that can be used when no more results are available.
