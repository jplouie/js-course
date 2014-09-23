// Insert your code here!
$(document).ready(function(){
  var jokesCollection = [];

  $('#joke-form').find('input').last().on('click', function(e){
    e.preventDefault();
    var question = $('.joke-form-question').val();
    var answer = $('.joke-form-answer').val();
    $.post('/api/jokes',{joke:{question: question, answer: answer}}, function(data){
      jokesCollection.push(data);
      $(document).trigger('new-joke');
    });
    $('.joke-form-question').val('');
    $('.joke-form-answer').val('');
  });

  $(document).on('new-joke', function(){
    $newJoke = $('<div class="joke" data-joke-id=' + jokesCollection[jokesCollection.length - 1].id + '><p class="joke-question">' + jokesCollection[jokesCollection.length - 1].question + '</p><p class="joke-answer">' + jokesCollection[jokesCollection.length - 1].answer + '</p><button class="delete">Delete</button></div>');
    $('.jokes').append($newJoke);
  });

  $('.jokes').on('click', '.delete', function(){
    var id = $(this).parent().data('joke-id');
    $.ajax({
      url: '/api/jokes/' + id,
      type: 'DELETE'
    });
    $(this).parent().remove();
  });

  $.get('/api/jokes', function(data){
    for(var i = 0; i < data.length; i++){
      jokesCollection.push(data[i]);
      $(document).trigger('new-joke', jokesCollection[i]);
    }
  });
});