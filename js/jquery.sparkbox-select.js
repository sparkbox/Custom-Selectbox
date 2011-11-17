(function($) {
  $.fn.sbCustomSelect = function(options) {
    var iOS = (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)),
        android = (navigator.userAgent.match(/Android/i)),
        UP = 38, DOWN = 40, SPACE = 32, RETURN = 13, TAB = 9,
        matchString = '';

    // Sync custom display with original select box and set selected class and the correct <li>
    var updateSelect = function () {
		var $select = $(this),
			$dropdown = $select.siblings('.sb-dropdown'),
			$sbSelect = $select.siblings('.sb-select');

		$sbSelect.val($select.val());
		$dropdown.find('li')
			.removeClass('selected')
			.filter('[data-value="'+selectorEscape($select.val())+'"')
				.addClass('selected');

	};




    // Update original select box, hide <ul>, and fire change event to keep everything in sync
    var dropdownSelection = function (e) {
		var $target = $(e.target),
			$select = $target.closest('.sb-custom').find('select');
		
		e.preventDefault();

		$target.closest('ul').fadeOut('fast');
		$select.val($target.closest('li').attr('data-value'));
		$select.trigger('change');
	};



    // Create the <ul> that will be used to change the selection on a non iOS/Android browser
    var createDropdown = function ($select) {
		var $options = $select.find('option'),
			$dropdown = $('<ul class="sb-dropdown"/>');

		$options.each(function () {
			var $this = $(this),
				$li = $('<li><a href=".">'+$this.text()+'</a></li>');

			$li.attr('class', $this.attr('class'));
			$li.attr('data-value', $this.attr('value'));
			
			$dropdown.append($li);
		});

		$dropdown.bind('click', dropdownSelection);

		return $dropdown;
	};





    // Clear keystroke matching string and show dropdown
    var viewList = function(e) {
      var $this = $(this);
      clear();

      $this.closest('.sb-custom').find('.sb-dropdown').fadeIn('fast');

      e.preventDefault();
    };

    // Hide the custom dropdown
    var hideDropdown = function(e) {
      if (!$(e.target).closest('.sb-custom').length) {
        $('.sb-dropdown').fadeOut('fast');
      }
    };

    // Manage keypress to replicate browser functionality
    var selectKeypress = function(e) {
      var $this = $(this),
          $current = $this.siblings('ul').find('.selected');

      if ((e.keyCode == UP || e.keyCode == DOWN || e.keyCode == SPACE) && $current.is(':hidden')) {
        $current.focus();
        return;
      }

      if (e.keyCode == UP && $current.prev().length) {
        e.preventDefault();
        $current.removeClass('selected');
        $current.prev().addClass('selected');
      } else if (e.keyCode == DOWN && $current.next().length) {
        e.preventDefault();
        $current.removeClass('selected');
        $current.next().addClass('selected');
      }

      if (e.keyCode == RETURN || e.keyCode == SPACE) {
        $current.trigger('click');
        return;
      }

      if (e.keyCode >= 48 && e.keyCode <= 90) {
        matchString += String.fromCharCode(e.keyCode);
        checkforMatch(e);
      }

      if (e.keyCode == TAB && $current.is(':visible')) {
        e.preventDefault();
        $current.trigger('click');
        hideDropdown(e);
      }
    };

    // Check keys pressed to see if there is a text match with one of the options
    var checkforMatch = function (e) {
		var $target = $(e.target);
		$target.siblings('ul').find('a').filter(function () {
			return $(this).text().toUpperCase().indexOf(matchString) === 0;
		}).first().trigger('click');
	};

    // Clear the string used for matching keystrokes to select options
    var clear = function() {
      matchString = '';
    };


	var selectorEscape = function (val) {
		return val.toString().replace(/([ #;&,.+*~':"%!^$[\]\(\)=>|\/])/g, '\\\\$1');
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
        .wrap('<div class="sb-custom"/>')
        .after('<input type="text" class="sb-select" readonly="readonly" />')
        .bind('change', updateSelect);


      if (iOS || android) {
        $self.show().css({
          'display': 'block',
          'opacity': 0,
          'position': 'absolute',
          'width': '100%',
          'z-index': 1000
        });
      } else {

        $self.next().bind('click', viewList).after(createDropdown($self));
      }

      $self.trigger('change');
    });

    // Hide dropdown when click is outside of the input or dropdown
    $(document).bind('click', hideDropdown);

    $('.sb-custom').find('.sb-select').live('keydown', selectKeypress);
    $('.sb-custom').bind('blur', clear);
    $('.sb-dropdown').live('focus', viewList);

    return this;
  };
})(jQuery);