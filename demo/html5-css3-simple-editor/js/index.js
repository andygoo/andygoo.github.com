/*
source: https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla#Executing_Commands
*/

$('.wysiwyg-controls a').on('click', function(e) {
  
  e.preventDefault();
  document.execCommand($(this).data('role'), false);
});