$(document).ready(function() {
  
  $('.sparkbox-custom').sbCustomSelect();
  
  // Animate the drop down based on location
  $('.sb-dropdown').hover(
      
      // when mouse is over
      function() {
        
        $(this).mousemove(function(event) {
          
          // where is the mouse within the menu?
          var mouseMenuY = event.originalEvent.layerY;
          
          // where is the menu located?
          var dropdownY = $(this).parent().offset().top;
          
          //the difference
          var deltaY = (mouseMenuY + dropdownY) * 0.25;
          
          //animate the menu in the negative direction
          $('.sb-dropdown').css("margin-top", (-deltaY.toString()) + "px");
          
        });
        
      },
      
      // when mouse leaves
      function() {
        //$(this).css("margin-top", "0px");
        
        $(this).animate({marginTop: 0}, 250);
         
      });
  
});