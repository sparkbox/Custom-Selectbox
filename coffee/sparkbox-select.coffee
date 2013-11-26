(($) ->
  selectboxCounter = 0
  $.fn.sbCustomSelect = (options) ->
    UP = 38
    DOWN = 40
    SPACE = 32
    RETURN = 13
    TAB = 9
    keyCodeArray = [UP, DOWN, SPACE, RETURN, TAB]
    matchString = ""
    settings = $.extend(
      appendTo: false
    , options)

    # Sync custom display with original select box and set selected class and the correct <li>
    updateSelect = ->
      $this = $(this)
      $dropdown = $(".sb-dropdown[data-id=" + $this.parent().data("id") + "]")
      $sbSelectContext = $this.parents(".sb-custom")
      $sbSelect = $(".sb-select", $sbSelectContext)
      unless @selectedIndex is -1
        $sbSelect.val this[@selectedIndex].innerHTML
        $dropdown.children().removeClass("selected").filter(":contains(" + this[@selectedIndex].innerHTML + ")").addClass "selected"

    # Update original select box, hide <ul>, and fire change event to keep everything in sync
    dropdownSelection = (e) ->
      $target = $(e.target)
      id = $target.closest("ul").attr("data-id")
      $option = $(".sb-custom[data-id=" + id + "]").find("option").filter("[value=\"" + $target.data("value") + "\"]")
      e.preventDefault()
      $option[0].selected = true
      $target.closest("ul").fadeOut "fast"
      $option.parent().trigger "change"

    # Create the <ul> that will be used to change the selection on a non iOS/Android browser
    createDropdown = ($select, i) ->
      $options = $select.children()
      dropdown = 
      """
        <ul data-id="#{i}" role="menu" class="dropDown-list sb-dropdown">
      """

      $options.each ->
        $this = $(this)
        val = $this.val()
        text = $this.text()

        dropdown += 
        """
          <li class="dropDown-listItem" data-value="#{val}">
            <a class="dropDown-link" data-value="#{val}" href="#">#{text}</a>
          </li>
        """

      dropdown += "</ul>"
      $dropdown = $(dropdown)
      $dropdown.bind "click", dropdownSelection
      $dropdown

    # Clear keystroke matching string and show dropdown
    viewList = (e) ->
      $this = $(this).siblings("ul")
      id = $this.data("id")
      clearKeyStrokes()
      $(".sb-dropdown").filter("[data-id!=" + id + "]").fadeOut "fast"
      $(".sb-dropdown").filter("[data-id=" + id + "]").fadeIn "fast"
      e.preventDefault()

    # Hide the custom dropdown
    hideDropdown = (e) ->
      $(".sb-dropdown").fadeOut "fast"  unless $(e.target).closest(".sb-custom").length

    # Manage keypress to replicate browser functionality
    selectKeypress = (e) ->
      $this = $(this)
      $current = $(".sb-dropdown[data-id=" + $this.children(".sb-select").data("id") + "]").find(".selected")

      if $.inArray(e.keyCode, keyCodeArray) is -1
        matchString += String.fromCharCode(e.keyCode)
        checkforMatch e
      if (e.keyCode is UP or e.keyCode is DOWN or e.keyCode is SPACE) and $current.is(":hidden")
        $current.focus()
        return
      if (e.keyCode is TAB or e.keyCode is RETURN or e.keyCode is SPACE) and $current.is(":visible")
        e.preventDefault()
        $current.trigger "click"
        hideDropdown e
      if e.keyCode is UP and $current.prev().length
        e.preventDefault()
        $current.removeClass "selected"
        $current.prev().addClass "selected"
      else if e.keyCode is DOWN and $current.next().length
        e.preventDefault()
        $current.removeClass "selected"
        $current.next().addClass "selected"

    # Check keys pressed to see if there is a text match with one of the options
    checkforMatch = (e) ->
      re = "/" + matchString + ".*/"
      $(e.target).parent().siblings("ul").find("a").each ->
        if @innerHTML.toUpperCase().indexOf(matchString) is 0
          $(this).trigger "click"
          return

    # Clear the string used for matching keystrokes to select options
    clearKeyStrokes = ->
      matchString = ""

    @each ->
      $self = $(this)
      $self.addClass "sparkbox-custom"
      wrapperDiv = """
        <div data-id="#{selectboxCounter}" class="sb-custom" />
      """
      inputHTML = """
        <div class="dropDown-trigger">
          <input data-id="#{selectboxCounter}" type="text" class="dropDown-currentValue sb-select" readonly="readonly" />
          <span aria-hidden="true" data-icon="&#xe001;"></span>
        </div>
      """
      $self.attr("tabindex", -1).wrap(wrapperDiv).after(inputHTML).on "change", updateSelect
      if Modernizr.touch
        $self.show().css
          height: $self.next(".dropDown-trigger").innerHeight()
          width: $self.next(".dropDown-trigger").width()
          "font-size": "16px"
      else
        $self.next(".dropDown-trigger").on "click", viewList
        unless settings.appendTo
          $self.after createDropdown($self, selectboxCounter)
        else
          offset = $self.parent().offset()
          $(settings.appendTo).append createDropdown($self, selectboxCounter).css(
            top: offset.top
            left: offset.left
            width: $self.parent().width() * 0.8
          )
      $self.trigger "change"
      selectboxCounter++


    # Hide dropdown when click is outside of the input or dropdown
    $(document).on "click", hideDropdown
    $(".dropDown-trigger").on "keydown", selectKeypress
    $(".dropDown-trigger").on "blur", clearKeyStrokes
    $(document).on "focus", ".dropDown-trigger", viewList
    this
) jQuery
