$(document).ready(function(){
  $('.start').on('click', function(){
    $(document).trigger('reset');
  });

  $(document).on('reset', function(){
    resetBoard();
    displayBoard();
    $('.piece').remove();
    showPieces();
    turns = 0;
    $(document).on('displayTurnsPassed', 0);
    $(document).trigger('games');
  });

  $(document).on('boardChange', function(){
    displayBoard();
  });

  $(document).on('games', function(){
    $('#games').text('Games Played: ' + gameCount++);
  });

  $(document).on('errors', function(){
    $('#errors').text('Errors Made: ' + ++errorCount);
  });

  $(document).on('pieceTaken', function(e, enemyRow, enemyCol){
    var $position = $('.row-' + numToChar[enemyRow] + ' .col-' + enemyCol);
    $position.empty();
    board[enemyRow][enemyCol] = ' X ';
    if(currentPlayer === 'wht'){
      redTaken++;
    }
    else if(currentPlayer === 'red'){
      whiteTaken++;
    }
    $('#pieces').text('White pieces taken: ' + whiteTaken + ', Red pieces taken: ' + redTaken)
  });

  $(document).on('invalidMove', function(e, jump){
    console.log('That is not a valid move.');
    $(document).trigger('errors');
    if(jump){
      console.log('You must jump the opponent this turn.');
    }
  });

  $(document).on('taunt', function(e, currentPlayer){
    console.log(currentPlayer + ' has just captured a piece!!');
  });

  $(document).on('displayTurnsPassed', function(e, turns){
    $('#turns').text('Turns played: ' + turns);
  });

  $('.row').on('click', function(){
    var rowClass = $(this).attr('class');
    var row = rowClass[rowClass.length - 1];
    if(clicks === 1){
      clickInput.startRow = row;
      clicks++;
    }
    else if(clicks === 2){
      clickInput.endRow = row;
      attemptMove(clickInput.startRow, clickInput.startCol, clickInput.endRow, clickInput.endCol);
      clickInput = {};
      clicks = 1;
    }
  });

  $('.col').on('click', function(){
    var colClass = $(this).attr('class');
    if(colClass.length === 9){
      var col = colClass[colClass.length - 1];
      if(clicks === 1){
        clickInput.startCol = parseInt(col);
      }
      else if(clicks === 2){
        clickInput.endCol = parseInt(col);
      }
    }
  });

  $(document).on('king', function(e, row, col, color){
    var $position = $('.row-' + row + ' .col-' + col);
    $position.children().removeClass(color).addClass(color + 'King');
    board[charToNum[row]][col] = board[charToNum[row]][col].toUpperCase();
  });
});