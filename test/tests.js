$(document).ready(function() {

  $originalSelect = $('#browsers');
  $originalSelect.sbCustomSelect();
  $sbDropdown = $originalSelect.closest('.sb-custom').find('.sb-dropdown');
  
  $soloSelect = $('#solo');
  $soloSelect.sbCustomSelect();
  $solosbDropdown = $soloSelect.closest('.sb-custom').find('.sb-dropdown'); 
  
  $emptySelect = $('#empty');
  $emptySelect.sbCustomSelect();
  $emptysbDropdown = $soloSelect.closest('.sb-custom').find('.sb-dropdown');
  

  module("Sparkbox Custom Select Tests");
  
  test('Dropdown List Populated Correctly',function() {
    equals($originalSelect.children().length, $sbDropdown.children().length, 'Dropdown created with correct number of elements');
    equals($originalSelect.children().eq(0).text(), $sbDropdown.children().eq(0).text(), 'Text of first elements matches');    
  });
  
  test('Listing Shows on click',function() {
    $('.sb-select').trigger('click');
    ok($sbDropdown.is(':visible'), 'Dropdown showing on click');
    $(document).trigger('click');
  });
  
  test('Selecting an option',function() {
    $sbDropdown.find('a').eq(0).trigger('click');
    equal($originalSelect.val(), 'the_googs', 'Selecting an option');
    $sbDropdown.find('a').eq(1).trigger('click');
    equal($originalSelect.val(), 'the_faris', 'Selecting an option');
    $sbDropdown.find('a').eq(3).trigger('click');
    equal($originalSelect.val(), 'the_splora 7', 'Selecting an option');
    $sbDropdown.find('a').eq(4).trigger('click');
    equal($originalSelect.val(), 'the_splora 8', 'Selecting an option');
    
    $sbDropdown.find('a').eq(0).trigger('click');
  });
  
  test('Changing the select directly',function() {
    $originalSelect.val('foxfire').trigger('change');
    
    equal($originalSelect.val(), 'foxfire', 'The original select is set correctly');
    equal($sbDropdown.find('.selected').data('sb-option').attr('value'), 'foxfire', 'The dropdown is set correctly');

    $sbDropdown.find('a').eq(0).trigger('click');  
  });
  
  test('Adding a select to the page via JS', function () {
    $newSelect = $('<select class="sparkbox-custom"><option class="bears" value="bears">Bears</option><option class="broncos" value="broncos">Broncos</option><option class="bengals" value="bengals">Bengals</option></select>');
    $('.select-container').prepend($newSelect);
    $newSelect.sbCustomSelect();
    $newDropDown = $newSelect.closest('.sb-custom').find('.sb-dropdown');
    $newsbSelect = $newSelect.closest('.sb-custom').find('.sb-select');
    
    test('Dropdown List Populated Correctly',function() {
      equals($newSelect.children().length, $newDropDown.children().length, 'Dropdown created with correct number of elements');
      equals($newSelect.children().eq(0).text(), $newDropDown.children().eq(0).text(), 'Text of first elements matches');    
    });

    test('Listing Shows on click',function() {
      $newsbSelect.trigger('click');
      ok($newDropDown.is(':visible'), 'Dropdown showing on click');
      $(document).trigger('click');
    });

    test('Selecting an option',function() {
      $newDropDown.find('a').eq(0).trigger('click');
      equal($newSelect.val(), 'bears', 'Selecting an option');
      
      $newDropDown.find('a').eq(1).trigger('click');
      equal($newSelect.val(), 'broncos', 'Selecting an option');

      $newDropDown.find('a').eq(0).trigger('click');
    });
    
  });
  
  module("Select box with one option");
  
  test('Dropdown List Populated Correctly',function() {
    equals($soloSelect.children().length, $solosbDropdown.children().length, 'Dropdown created with correct number of elements');
    equals($soloSelect.children().eq(0).text(), $solosbDropdown.children().eq(0).text(), 'Text of first elements matches');    
  });
  
  test('Listing Shows on click',function() {
    $('.sb-select').trigger('click');
    ok($solosbDropdown.is(':visible'), 'Dropdown showing on click');
    $(document).trigger('click');
  });
  
  test('Selecting an option',function() {
    $solosbDropdown.find('a').eq(0).trigger('click');
    equal($soloSelect.val(), 'uno', 'Selecting an option');
  });
  
  module('Implementation Tests');
  
  test('Custom Select Created',function() {
    ok($soloSelect.parent().hasClass('sb-custom'), '<select> element wrapped');
    ok($('.sb-select').has('[type=text]'), 'New input created');
  });
  
});