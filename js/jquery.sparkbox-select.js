(function($) {

  $.fn.sbCustomSelect = function(options) {
    var iOS = (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)),
        android = (navigator.userAgent.match(/Android/i)),
        LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40, SPACE = 32, RETURN = 13, TAB = 9, ESC = 27, PGUP = 33, PGDOWN = 34,
        matchString = '',
        settings = $.extend({
          appendTo: false
        }, options);

    var scrollToSelected = function($dropdown, recover) {
        var $selected = $dropdown.find('li.selected');
        if(!$selected.length) return true;

        //recover scroll position (after fadeOut)
        if($dropdown.data('sb-saved-scrollTo') && recover) $dropdown.scrollTop($dropdown.data('sb-saved-scrollTo'));

        //we can't just use $selected.position().top, if the sb-dropdown is positioned static -.-
        var scrollTop = $dropdown.scrollTop(),
        offset = ($selected.offset().top+scrollTop-$dropdown.offset().top);

        if(offset < scrollTop) {
            $dropdown.scrollTop(offset);
        } else if($dropdown.innerHeight()+scrollTop < offset+$selected.outerHeight()) {
            var scrollTo = offset+$selected.outerHeight()-$dropdown.innerHeight();
            $dropdown.scrollTop(scrollTo);
        }
        $dropdown.data('sb-saved-scrollTo', $dropdown.scrollTop());
    }

    // Sync custom display with original select box and set selected class and the correct <li>
    var updateSelect = function(select) {
      var $select = this === window ? $(select) : $(this),
          $dropdown = $select.parent().data('sb-dropdown'),
          $sbSelect = $select.siblings('.sb-select');

      if ($select.attr("selectedIndex") != -1) {
        $sbSelect.val($select.children().eq($select.attr("selectedIndex")).html());

        if($dropdown) {
            $dropdown.children('.selected').removeClass('selected');
            $dropdown.children().eq($select.attr("selectedIndex")).addClass('selected');
            scrollToSelected($dropdown);
        }
      }
    };

    // Update original select box, hide <ul>, and fire change event to keep everything in sync
    var dropdownSelection = function(e, preventClose) {
      e.preventDefault();
      var $target = $(e.target).parent('li').andSelf().filter('li');
      if(!$target.length) return true;

      var $option = $target.data('sb-option');

      $option[0].selected = true;
      if(!preventClose) {
          hideDropdown({});
          if($option.parent().data('lastVal') != $option.parent().val()) $option.parent().data('lastVal', $option.parent().val()).trigger('change');
      } else updateSelect($option.parent());
    };
    
    // Create the <ul> that will be used to change the selection on a non iOS/Android browser
    var createDropdown = function($select) {
      var $options = $select.children(),
          $dropdown = $('<ul class="sb-dropdown"/>').data('sb-custom', $select.parent());
      
      $options.each(function() {
        $this = $(this);
        $('<li><a href=".">' + $this.text() + '</a></li>').data('sb-option', $this).appendTo($dropdown);
      });
      
      return $dropdown;
    };
    
    // Clear keystroke matching string and show dropdown
    var viewList = function(e) {
      var $dropdown = $(this).parent().data('sb-dropdown') || $(this);

      clearKeyStrokes();

      hideDropdown({target: $dropdown});
      $dropdown.addClass('active').stop().fadeTo('fast', 1);

      scrollToSelected($dropdown, true);

      e.preventDefault();
    };
    
    // Hide the custom dropdown
    var hideDropdown = function(e) {
        var $matches = $(e.target).closest('.sb-dropdown, .sb-custom'),
            $prevent = $matches.data('sb-dropdown') || $matches;

        $('.sb-dropdown').not($prevent).removeClass('active').stop().fadeOut('fast');
    };

    var keepFocus = function() {
        if(($(this).parent().data('sb-dropdown').is('.active'))) $(this).focus();
    }

    // Manage keypress to replicate browser functionality
    var selectKeypress = function(e) {
      var $this = $(this),
          $current = $this.parent().data('sb-dropdown').find('.selected');

      //select in dropdown if it's open... else directly change select value to target element
      function softSelect(el) {
          if($current.is(':hidden')) $(el).trigger('click');
          else $(el).addClass('selected').trigger('click', true);
      }

      if (e.keyCode >= 48 && e.keyCode <= 90) {
        matchString += String.fromCharCode(e.keyCode);

        var matches = [],
            matchFirstChar = false;

        if(!matchString.replace(new RegExp(matchString[0],"g"), '').length) matchFirstChar = true;

        $current.siblings('li').andSelf().children('a').each(function() {
            if ($.trim(this.innerHTML.toUpperCase()).indexOf(matchFirstChar ? matchString[0] : matchString) === 0) {
                matches.push(this);
            }
        });
        if (matches.length) {
            if(matchFirstChar) {
                softSelect($(matches[($(matches).index($current.find('a'))+1)%matches.length]).parent());
            }
            else softSelect($(matches[0]).parent());
        }
      } else clearKeyStrokes();

      if ((e.keyCode == RETURN || e.keyCode == SPACE) && $current.is(':hidden')) {
        $current.focus();
        e.preventDefault();
        return;
      }

      function nextPage(elements) {
        var hideAfter = false;
        if($current.is(':hidden')) {
            $current.parent().show();
            hideAfter = true;
        }
        var targetDistance = $current.parent().innerHeight()-($current.outerHeight()*2),
            distance = 0,
            $target = $(elements).last();

        elements.each(function() {
            if(distance < targetDistance) distance += $(this).outerHeight();
            else {
                $target = $(this);
                return false;
            }
        });
        if(hideAfter) $current.parent().hide();
        softSelect($target);
      }

      switch (e.keyCode) {
          case UP:
          case LEFT:
              e.preventDefault();
              if($current.prev().length) softSelect($current.prev());
              break;
          case RIGHT:
          case DOWN:
              e.preventDefault();
              if($current.next().length) softSelect($current.next());
              break;
          case PGUP:
              e.preventDefault();
              nextPage($current.prevAll());
              break;
          case PGDOWN:
              e.preventDefault();
              nextPage($current.nextAll());
              break;
      }

      if ((e.keyCode == TAB  && $current.is(':visible')) || e.keyCode == RETURN || e.keyCode == SPACE || e.keyCode == ESC) {
        $current.trigger('click');
        e.preventDefault();
        return;
      }
    };
    
    // Clear the string used for matching keystrokes to select options
    var clearKeyStrokes = function() {
      matchString = '';
    };
    
    
    
    /* jQuery Plugin Loop
     *
     * Take the select box out of the tab order.
     *
     * Add the field that will show the currently selected item and attach the change event to update the .sb-select input.
     *
     * If this is iOS or Android then we want to use the browsers standard UI controls. Set the opacity of the select to 0
     * and lay it over our custom display of the current value.
     * Otherwise, we're going to create a custom <ul> for the dropdown
     *
     * After all of the setup is complete, trigger the change event on the original select box to update the .sb-select input
     */
    this.each(function() {
      var $self = $(this),
          $sbCustom = $('<div class="sb-custom"/>');

      $self.attr('tabindex', -1)
        .after($sbCustom)
        .appendTo($sbCustom)
        .after('<input type="text" class="sb-select" readonly="readonly" />');
      
      
      if (iOS || android) {
        $self.show().css({
          'display': 'block',
          'height': $self.next().innerHeight(),
          'opacity': 0,
          'position': 'absolute',
          'width': '100%',
          'z-index': 1000
        });
      } else {

        $sbCustom.data('sb-dropdown', createDropdown($self));

        if (!settings.appendTo) {
            $sbCustom.append($sbCustom.data('sb-dropdown'));
        } else {
          var offset = $self.parent().offset();

          $(settings.appendTo).append($sbCustom.data('sb-dropdown').css({
            'top': offset.top,
            'left': offset.left,
            'width': $self.parent().width() * 0.8
          }));
        }

        $self.data('lastVal', $self.val());
      }

      updateSelect($self);
    });
    
    // Hide dropdown when click is outside of the input or dropdown
    $(document).bind('mousedown', hideDropdown)
        .delegate('.sb-custom', 'blur', clearKeyStrokes)
        .delegate('.sb-custom select', 'change', updateSelect)
        .delegate('.sb-select', 'keydown', selectKeypress)
        .delegate('.sb-select', 'click', viewList)
        .delegate('.sb-dropdown', 'focus', viewList)
        .delegate('.sb-dropdown', 'click', dropdownSelection)
        .delegate('.sb-select', 'focusout', keepFocus);

    return this;
  };
})(jQuery);