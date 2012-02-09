(function($) {
  var selectboxCounter = 0;
  
  $.fn.sbCustomSelect = function(options) {
    var iOS = (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)),
        android = (navigator.userAgent.match(/Android/i)),
        LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40, SPACE = 32, RETURN = 13, TAB = 9, ESC = 27, PGUP = 33, PGDOWN = 34,
        matchString = '',
        settings = $.extend({
          appendTo: false
        }, options);

    var scrollToSelected = function() {
        var $selected = $('.sb-dropdown:visible li.selected');
        if(!$selected.length) return true;

        //recover scroll position (after fadeOut)
        if($selected.parent().data('sb-saved-scrollTo')) $selected.parent().scrollTop($selected.parent().data('sb-saved-scrollTo'));

        //we can't just use $selected.position().top, if the sb-dropdown is positioned static -.-
        var scrollTop = $selected.parent().scrollTop(),
        offset = ($selected.offset().top+scrollTop-$selected.parent().offset().top);

        if(offset < scrollTop) {
            $selected.parent().scrollTop(offset);
            $selected.parent().data('sb-saved-scrollTo', offset)
        } else if($selected.parent().innerHeight()+scrollTop < offset+$selected.outerHeight()) {
            var scrollTo = offset+$selected.outerHeight()-$selected.parent().innerHeight();
            $selected.parent().scrollTop(scrollTo);
            $selected.parent().data('sb-saved-scrollTo', scrollTo);
        }
    }

    // Sync custom display with original select box and set selected class and the correct <li>
    var updateSelect = function() {
      var $this = $(this),
          $dropdown = $('.sb-dropdown[data-id=' + $this.parent().data('id') + ']'),
          $sbSelect = $this.siblings('.sb-select');

      if (this.selectedIndex != -1) {
        $sbSelect.val(this[this.selectedIndex].innerHTML);
      
        var $selected = $dropdown.children().removeClass('selected').eq(this.selectedIndex).addClass('selected');

        scrollToSelected();
      }
    };

    // Update original select box, hide <ul>, and fire change event to keep everything in sync
    var dropdownSelection = function(e, preventClose) {
      e.preventDefault();
      var $target = $(this).children('li').andSelf().filter($(e.target).parents('li').andSelf()).filter('li');
      if(!$target.length) return true;

      var id = $target.parent().attr('data-id'),
          $option = $('.sb-custom[data-id=' + id + ']').find('option').filter('[value="' + $target.data('value') + '"]');

      $option[0].selected = true;
      if(!preventClose) {
          hideDropdown({});
          if($option.parent().data('lastVal') != $option.parent().val()) $option.parent().data('lastVal', $option.parent().val()).trigger('change');
      } else $option.trigger('sb-sync');
    };
    
    // Create the <ul> that will be used to change the selection on a non iOS/Android browser
    var createDropdown = function($select, i) {
      var $options = $select.children(),
          $dropdown = $('<ul data-id="' + i + '" class="sb-dropdown"/>');
      
      $options.each(function() {
        $this = $(this);
        $dropdown.append('<li data-value="' + $this.val() + '"><a href=".">' + $this.text() + '</a></li>');
      });
      $dropdown.bind('click', dropdownSelection);
      
      return $dropdown;
    };
    
    // Clear keystroke matching string and show dropdown
    var viewList = function(e) {
      var $this = $(this),
          id = $this.data('id');
          
      clearKeyStrokes();

      $('.sb-dropdown[data-id!=' + id + ']').fadeOut('fast');
      $('.sb-dropdown[data-id=' + id + ']').fadeIn('fast');

      scrollToSelected();

      e.preventDefault();
    };
    
    // Hide the custom dropdown
    var hideDropdown = function(e) {
        var id = $(e.target).closest('.sb-dropdown').add($(e.target).closest('.sb-custom')).data('id'),
            $prevent = $('.sb-dropdown[data-id=' + id + ']');

        $('.sb-dropdown').not($prevent).fadeOut('fast');
    };

    // Manage keypress to replicate browser functionality
    var selectKeypress = function(e) {
      var $this = $(this),
          $current = $('.sb-dropdown[data-id=' + $this.data('id') + ']').find('.selected');

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
      var $self = $(this);

      $self.attr('tabindex', -1)
        .wrap('<div data-id="' + selectboxCounter + '" class="sb-custom"/>')
        .after('<input data-id="' + selectboxCounter + '" type="text" class="sb-select" readonly="readonly" />')
        .bind('change sb-sync', updateSelect);
      
      
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
        
        $self.next().bind('click', viewList);
        
        if (!settings.appendTo) {
          $self.after(createDropdown($self, selectboxCounter));
        } else {
          var offset = $self.parent().offset();
          
          $(settings.appendTo).append(createDropdown($self, selectboxCounter).css({
            'top': offset.top,
            'left': offset.left,
            'width': $self.parent().width() * 0.8
          }));
        }
      }

      $self.data('lastVal', $self.val());
      $self.trigger('sb-sync');
      selectboxCounter++;
    });
    
    // Hide dropdown when click is outside of the input or dropdown
    $(document).bind('click', hideDropdown);
    
    $('.sb-custom').find('.sb-select').live('keydown', selectKeypress);
    $('.sb-custom').bind('blur', clearKeyStrokes);
    $(document).delegate('.sb-dropdown', 'focus', viewList);
    
    return this;
  };
})(jQuery);