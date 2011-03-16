(function($) {
  $.fn.sbCustomSelect = function(options) {
    var iOS = (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)),
        android = (navigator.userAgent.match(/Android/i)),
        UP = 38,
        DOWN = 40,
        SPACE = 32,
        RETURN = 13,
        TAB = 9,
        matchString = '';

    var updateSelect = function() {
      var $this = $(this),
          $dropdown = $this.siblings().filter('.sb-dropdown');
          
      $this.next().val($this.val());
      
      $dropdown.children().remove('selected')
        .filter(':contains(' + $this.val() + ')').addClass('selected');
      
      
    };
    
    var dropdownSelection = function(e) {
      var $target = $(e.target),
          $option = $target.closest('.sb-custom').find('option').filter(':contains(' + $target.text() + ')');

      e.preventDefault();
      
      $target.parent().addClass('selected').siblings().removeClass('selected');
      $option[0].selected = true;
      $target.closest('ul').fadeOut('fast');
      $option.parent().trigger('change');
    };
    
    var createDropdown = function($select) {
      var $options = $select.children(),
          $dropdown = $('<ul class="sb-dropdown"/>');
      
      $options.each(function() {
        $dropdown.append('<li><a href=".">' + $(this).text() + '</a></li>');
      });
      $dropdown.bind('click', dropdownSelection);
      
      return $dropdown;
    };
    
    var selectAction = function(e) {
      $this = $(this);
      
      clear();
      $this.next().fadeIn('fast');
    };
    
    var viewList = function() {
      var $this = $(this);
      if ($this.is(':hidden')) {
        $this.parent().fadeIn('fast');
      }
    };
    
    var hideDropdown = function(e) {
      if (!$(e.target).closest('.sb-custom').length) {
        $('.sb-dropdown').fadeOut('fast');
      } 
    };
    
    var selectKeypress = function(e) {
      var $this = $(this),
          $current = $this.siblings('ul').find('.selected');
      
      if ((e.keyCode == UP || e.keyCode == DOWN || e.keyCode == SPACE) && $current.is(':hidden')) {
        $current.parent().fadeIn('fast');
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
      
      // if (e.keyCode == TAB && e.shiftKey && $current.is(':hidden')) {
      //   e.preventDefault();
      //   $this.prev().prev().focus();
      // }
      
    };
    
    var checkforMatch = function(e) {
      
      var re = '/' + matchString + '.*/';
      
      $(e.target).siblings('ul').find('a').each(function() {
        if (this.innerHTML.toUpperCase().indexOf(matchString) === 0) {
          $(this).trigger('click');
          return;
        }
      });
    };
    
    var clear = function() {
      matchString = '';
    };
    
    this.each(function() {
      var $self = $(this);

      $self.attr('tabindex', -1)
        .wrap('<div class="sb-custom"/>')
        .after('<input type="text" class="sb-select" readonly="readonly" />')
        .bind('change', updateSelect);
       
      if (iOS || android) {
        $self.show().css({
          'opacity': 0,
          'position': 'relative',
          'z-index': 1000
        });
      } else {
        $self.next().after(createDropdown($self));
        $self.next().bind('click', selectAction);
      }

      $self.trigger('change');
    });
    
    $(document).bind('click', hideDropdown);

    $('.sb-custom').find('.sb-select').live('keydown', selectKeypress);
    
    $('.sb-custom').bind('blur', clear);
    
    $('.sb-dropdown').live('focus', viewList);
    
    return this;
  };
})(jQuery);