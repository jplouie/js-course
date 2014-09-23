var board, currentPlayer;
var turns = 0;
var gameCount = 0;
var errorCount = 0;
var clickInput = {};
var multiJumpInput = {};
var clicks = 1;
var redTaken = 0;
var whiteTaken = 0;

var resetBoard = function () {
  board = [
    [' X ', 'wht', ' X ', 'wht', ' X ', 'wht', ' X ', 'wht'],
    ['wht', ' X ', 'wht', ' X ', 'wht', ' X ', 'wht', ' X '],
    [' X ', 'wht', ' X ', 'wht', ' X ', 'wht', ' X ', 'wht'],
    [' X ', ' X ', ' X ', ' X ', ' X ', ' X ', ' X ', ' X '],
    [' X ', ' X ', ' X ', ' X ', ' X ', ' X ', ' X ', ' X '],
    ['red', ' X ', 'red', ' X ', 'red', ' X ', 'red', ' X '],
    [' X ', 'red', ' X ', 'red', ' X ', 'red', ' X ', 'red'],
    ['red', ' X ', 'red', ' X ', 'red', ' X ', 'red', ' X ']
  ];

  currentPlayer = 'wht';
};

var showPieces = function(){
  for(var i = 0; i < board.length; i++){
    for(var j = 0; j < board[i].length; j++){
      var $position = $('.row-' + numToChar[i] + ' .col-' + j);
      if(board[i][j] === 'wht'){
        $position.append('<span class="piece white"></span>');
      }
      else if(board[i][j] === 'red'){
        $position.append('<span class="piece red"></span>');
      }
    }
  }
}

var removeJumpedPiece = function(row1, col1, row2, col2){
  var removeRowNum = (charToNum[row1] + charToNum[row2]) / 2;
  var removeColNum = (col1 + col2) / 2;
  $(document).trigger('pieceTaken', [removeRowNum, removeColNum]);
  $(document).trigger('taunt', currentPlayer);
};

var changePlayer = function(player){
  if(player === 'wht'){
    currentPlayer = 'red';
    $('#player').text("Player's turn: Red");
  }
  else{
    currentPlayer = 'wht'
    $('#player').text("Player's turn: White");
  }
};

var makeMove = function(row1, col1, row2, col2){
  var $position1 = $('.row-' + row1 + ' .col-' + col1);
  var $position2 = $('.row-' + row2 + ' .col-' + col2);
  rowNum1 = charToNum[row1];
  rowNum2 = charToNum[row2];


  if(currentPlayer === 'wht'){
    if(board[rowNum1][col1] === 'wht'){
      board[rowNum2][col2] = 'wht';
      $position2.append('<span class="piece white"></span>');
      if(row2 === 'h'){
        $(document).trigger('king', [row2, col2, 'white']);
      }
    }
    else if(board[rowNum1][col1] === 'WHT'){
      board[rowNum2][col2] = 'WHT';
      $position2.append('<span class="piece whiteKing"></span>');
    }
  }
  else if(currentPlayer === 'red'){
    if(board[rowNum1][col1] === 'red'){
      board[rowNum2][col2] = 'red';
      $position2.append('<span class="piece red"></span>');
      if(row2 === 'a'){
        $(document).trigger('king', [row2, col2, 'red']);
      }
    }
    else if(board[rowNum1][col1] === 'RED'){
      board[rowNum2][col2] = 'RED';
      $position2.append('<span class="piece redKing"></span>');
    }
  }
  board[rowNum1][col1] = ' X '; // REMOVES PIECE
  $position1.empty();
  changePlayer(currentPlayer);
  $(document).trigger('boardChange');
  $(document).trigger('displayTurnsPassed', ++turns);
};

var checkMove = function(row1, col1, row2, col2){
  var rowNum1 = charToNum[row1];
  var rowNum2 = charToNum[row2];
  // CHECKS IF COORDINATES ARE ON THE BOARD
  if(rowNum1 >= 0 && rowNum1 < 8 && col1 >= 0 && col1 < 8
    && rowNum2 >= 0 && rowNum2 < 8 && col2 >= 0 && col2 < 8){
    // CHECKS IF SINGLE MOVE FOWARD IS VALID 
    if((col1 - col2) == 1 || (col1 - col2) == -1){
      if(currentPlayer === 'wht' && rowNum2 - rowNum1 == 1
        && board[rowNum1][col1] === 'wht' && board[rowNum2][col2] === ' X '){
        return true;
      }
      else if(currentPlayer === 'red' && rowNum2 - rowNum1 == -1
        && board[rowNum1][col1] === 'red' && board[rowNum2][col2] === ' X '){
        return true;
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }
  }
  else{
    return false;
  }
};

var checkJumpMove = function(row1, col1, row2, col2){
  var rowNum1 = charToNum[row1];
  var rowNum2 = charToNum[row2];
  for(var i = 0; i < board.length; i++){
    for(var j = 0; j < board[i].length; j++){
      // CHECKS IF COORDINATES ARE ON THE BOARD
      if(rowNum1 >= 0 && rowNum1 < 8 && col1 >= 0 && col1 < 8
        && rowNum2 >= 0 && rowNum2 < 8 && col2 >= 0 && col2 < 8){
        // CHECKS IF JUMP IS VALID
        if((col1 - col2) == 2 || (col1 - col2) == -2){
          if(currentPlayer === 'wht'
            && board[rowNum1][col1] === 'wht' && board[rowNum2][col2] === ' X '
            && (board[(rowNum1 + rowNum2) / 2][(col1 + col2) / 2] === 'red'
              || board[(rowNum1 + rowNum2) / 2][(col1 + col2) / 2] === 'RED')){
            if(rowNum2 - rowNum1 == 2){
              return true;
            }
            else{
              return false;
            }
          }
          else if(currentPlayer === 'red'){
            if(rowNum2 - rowNum1 == -2
            && board[rowNum1][col1] === 'red' && board[rowNum2][col2] === ' X '
            && (board[(rowNum1 + rowNum2) / 2][(col1 + col2) / 2] === 'wht'
              || board[(rowNum1 + rowNum2) / 2][(col1 + col2) / 2] === 'WHT')){
              return true;
            }
            else{
              return false;
            }
          }
        }
        else{
          return false;
        }
      }
      else{
        return false;
      }
    }
  }
};

var checkForJump = function(){
  for(var i = 0; i < board.length; i++){
    for(var j = 0; j < board[i].length; j++){
      if(currentPlayer === 'wht' && board[i][j] === 'wht'){
        if(i < 6){
          if(((board[i + 1][j + 1] === 'red' || board[i + 1][j + 1] === 'RED') && board[i + 2][j + 2] === ' X ')
            || ((board[i + 1][j - 1] === 'red' || board[i + 1][j - 1] === 'RED') && board[i + 2][j - 2] === ' X ')){
            return true;
          }
        }
      }
      else if(currentPlayer === 'red' && board[i][j] === 'red'){
        if(i > 1){
          if(((board[i - 1][j + 1] === 'wht' || board[i - 1][j + 1] === 'WHT') && board[i - 2][j + 2] === ' X ')
            || ((board[i - 1][j - 1] === 'wht' || board[i - 1][j - 1] === 'WHT') && board[i - 2][j - 2] === ' X ')){
            return true;
          }
        }
      }
      // CHECKS KINGS FOR POSSIBLE JUMP MOVE
      else if(currentPlayer === 'wht' && board[i][j] === 'WHT'){
        if(i > 1){
          if(((board[i - 1][j - 1] === 'red' || board[i - 1][j - 1] === 'RED') && board[i - 2][j - 2] === ' X ')
          || ((board[i - 1][j + 1] === 'red' || board[i - 1][j + 1] === 'RED') && board[i - 2][j + 2] === ' X ')){
            return true;
          }
        }
        else if(i < 6){
          if(((board[i + 1][j + 1] === 'red' || board[i + 1][j + 1] === 'RED') && board[i + 2][j + 2] === ' X ')
            || ((board[i + 1][j - 1] === 'red' || board[i + 1][j - 1] === 'RED') && board[i + 2][j - 2] === ' X ')){
            return true;
          }
        }
      }
      else if(currentPlayer === 'red' && board[i][j] === 'RED'){
        if(i > 1){
          if(((board[i - 1][j - 1] === 'wht' || board[i - 1][j - 1] === 'WHT') && board[i - 2][j - 2] === ' X ')
            || ((board[i - 1][j + 1] === 'wht' || board[i - 1][j + 1] === 'WHT') && board[i - 2][j + 2] === ' X ')){
            return true;
          }
        }
        else if(i < 6){
          if(((board[i + 1][j + 1] === 'wht' || board[i + 1][j + 1] === 'WHT') && board[i + 2][j + 2] === ' X ')
            || ((board[i + 1][j - 1] === 'wht' || board[i + 1][j - 1] === 'WHT') && board[i + 2][j - 2] === ' X ')){
            return true;
          }
        }
      }
    }
  }
  return false;   // IF FINDS NO PIECE TO JUMP
};

var checkForMultiJump = function(row, col){
  var rowNum = charToNum[row];
  if(rowNum + 2 > 7 || rowNum - 2 < 0 || col + 2 > 7 || col - 2 < 0){
    return false;
  }
  else if(currentPlayer === 'red'){    // WHITE JUST MOVED
    if(board[rowNum][col] === 'wht'){
      if(((board[rowNum + 1][col + 1] === 'red' || board[rowNum + 1][col + 1] === 'RED') && board[rowNum + 2][col + 2] === ' X ')
        || ((board[rowNum + 1][col - 1] === 'red' || board[rowNum + 1][col - 1] === 'RED') && board[rowNum + 2][col - 2] === ' X ')){
        multiJumpInput.row = row;
        multiJumpInput.col = col;
        multiJumpInput.multiJump = true;
        return true;
      }
    }
    else if(board[rowNum][col] === 'WHT'){
      if(((board[rowNum + 1][col + 1] === 'red' || board[rowNum + 1][col + 1] === 'RED') && board[rowNum + 2][col + 2] === ' X ')
        || ((board[rowNum + 1][col - 1] === 'red' || board[rowNum + 1][col - 1] === 'RED') && board[rowNum + 2][col - 2] === ' X ')
        || ((board[rowNum - 1][col - 1] === 'red' || board[rowNum - 1][col - 1] === 'RED') && board[rowNum - 2][col - 2] === ' X ')
        || ((board[rowNum - 1][col + 1] === 'red' || board[rowNum - 1][col + 1] === 'RED') && board[rowNum - 2][col + 2] === ' X ')){
        multiJumpInput.row = row;
        multiJumpInput.col = col;
        multiJumpInput.multiJump = true;
        return true;
      }
    }
  }
  else if(currentPlayer === 'wht'){   // RED JUST MOVED
    if(board[rowNum][col] === 'red'){
      if(((board[rowNum - 1][col + 1] === 'wht' || board[rowNum - 1][col + 1] === 'WHT') && board[rowNum - 2][col + 2] === ' X ')
        || ((board[rowNum - 1][col - 1] === 'wht' || board[rowNum - 1][col - 1] === 'WHT') && board[rowNum - 2][col - 2] === ' X ')){
        multiJumpInput.row = row;
        multiJumpInput.col = col;
        multiJumpInput.multiJump = true;
        return true;
      }
    }
    else if(board[rowNum][col] === 'RED'){
      if(((board[rowNum + 1][col + 1] === 'wht' || board[rowNum + 1][col + 1] === 'WHT') && board[rowNum + 2][col + 2] === ' X ')
        || ((board[rowNum + 1][col - 1] === 'wht' || board[rowNum + 1][col - 1] === 'WHT') && board[rowNum + 2][col - 2] === ' X ')
        || ((board[rowNum - 1][col - 1] === 'wht' || board[rowNum - 1][col - 1] === 'WHT') && board[rowNum - 2][col - 2] === ' X ')
        || ((board[rowNum - 1][col + 1] === 'wht' || board[rowNum - 1][col + 1] === 'wht') && board[rowNum - 2][col + 2] === ' X ')){
        multiJumpInput.row = row;
        multiJumpInput.col = col;
        multiJumpInput.multiJump = true;
        return true;
      }
    }
  }
  multiJumpInput.multiJump = false;
  multiJumpInput.row = '';
  multiJumpInput.col = '';
  return false;
};

var checkKingMove = function(row1, col1, row2, col2){
  var rowNum1 = charToNum[row1];
  var rowNum2 = charToNum[row2];
  // CHECKS IF COORDINATES ARE ON THE BOARD
  if(rowNum1 >= 0 && rowNum1 < 8 && col1 >= 0 && col1 < 8
    && rowNum2 >= 0 && rowNum2 < 8 && col2 >= 0 && col2 < 8){
    // CHECKS IF MOVE IS DIAGONAL
    if((rowNum2 - rowNum1 === 1 && col2 - col1 === 1)
      || (rowNum2 - rowNum1 === 1 && col2 - col1 === -1)
      || (rowNum2 - rowNum1 === -1 && col2 - col1 === 1)
      || (rowNum2 - rowNum1 === -1 && col2 - col1 === -1)){
      if(board[rowNum2][col2] === ' X '){
        if(currentPlayer === 'wht' && board[rowNum1][col1] === 'WHT'){
          return true;
        }
        else if(currentPlayer === 'red' && board[rowNum1][col1] === 'RED'){
          return true;
        }
        else{
          return false;
        }
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }
  }
  else{
    return false;
  }
};

var checkKingJumpMove = function(row1, col1, row2, col2){
  var rowNum1 = charToNum[row1];
  var rowNum2 = charToNum[row2];
  // CHECKS IF COORDINATES ARE ON THE BOARD
  if(rowNum1 >= 0 && rowNum1 < 8 && col1 >= 0 && col1 < 8
    && rowNum2 >= 0 && rowNum2 < 8 && col2 >= 0 && col2 < 8){
    // CHECKS IF MOVE IS DIAGONAL
    if((rowNum2 - rowNum1 === 2 && col2 - col1 === 2)
      || (rowNum2 - rowNum1 === 2 && col2 - col1 === -2)
      || (rowNum2 - rowNum1 === -2 && col2 - col1 === 2)
      || (rowNum2 - rowNum1 === -2 && col2 - col1 === -2)){
      if(board[rowNum2][col2] === ' X '){
        if(currentPlayer === 'wht' && board[rowNum1][col1] === 'WHT'
          && (board[(rowNum1 + rowNum2) / 2][(col1 + col2) / 2] === 'red'
          || board[(rowNum1 + rowNum2) / 2][(col1 + col2) / 2] === 'RED')){
          return true;
        }
        else if(currentPlayer === 'red' && board[rowNum1][col1] === 'RED'
          && (board[(rowNum1 + rowNum2) / 2][(col1 + col2) / 2] === 'wht'
          || board[(rowNum1 + rowNum2) / 2][(col1 + col2) / 2] === 'WHT')){
          return true;
        }
        else{
          return false;
        }
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }
  }
  else{
    return false;
  }
};

var attemptMove = function(row1, col1, row2, col2){
  console.log('row1: ' + row1 + ' col1: ' + col1 + ' row2: ' + row2 + ' col2: ' + col2);
  console.log('multiJump? ' + checkForMultiJump(row2, col2));
  console.log('checkJump? ' + checkJumpMove(row1, col1, row2, col2));
  console.log('checkJumpMove? ' + checkJumpMove(row1, col1, row2, col2));
  console.log('checkKingJumpMove? ' + checkKingJumpMove(row1, col1, row2, col2));
  if(checkForJump()){
    if(checkJumpMove(row1, col1, row2, col2) || checkKingJumpMove(row1, col1, row2, col2)){
      if(multiJumpInput.multiJump){
        if(row1 === multiJumpInput.row && col1 === multiJumpInput.col){
          removeJumpedPiece(row1, col1, row2, col2);
          makeMove(row1, col1, row2, col2);
          // CHECKS FOR MULTIPLE JUMPS
          if(checkForMultiJump(row2, col2)){
            console.log('You can multi jump!!');
            changePlayer(currentPlayer);
          }
          return true;
        }
        else{
          $(document).trigger('invalidMove', checkForJump());
          return false;
        }
      }
      else{
        removeJumpedPiece(row1, col1, row2, col2);
        makeMove(row1, col1, row2, col2);
        // CHECKS FOR MULTIPLE JUMPS
        if(checkForMultiJump(row2, col2)){
          console.log('You can multi jump!!');
          changePlayer(currentPlayer);
        }
        return true;
      }
    }
    else{
      $(document).trigger('invalidMove', checkForJump());
      console.log('You can only multi jump with the same piece you just moved!');
      return false;
    }
  }
  else{
    if(checkMove(row1, col1, row2, col2) || checkKingMove(row1, col1, row2, col2)){
      makeMove(row1, col1, row2, col2);
      return true;
    }
    else{
      $(document).trigger('invalidMove', checkForJump());
      return false;
    }
  }
};

var getMove = function(){
  var input = {};
  var start = prompt(currentPlayer + ', please enter the row and column of the piece you want to move.');
  if(start[0].toLowerCase() === 'q'){
    return {quit: true};
  }
  input.startRow = start[0];
  input.startCol = parseInt(start[start.length - 1]);
  end = prompt('Please enter the row and column of the place you want to move that piece.');
  input.endRow = end[0];
  input.endCol = parseInt(end[end.length - 1]);
  return input;
};

var play = function(){
  $(document).trigger('reset');
  var input = {};
  while(true){
    input = getMove();
    if(input.quit){
      break;
    }
    var success = attemptMove(input.startRow, input.startCol, input.endRow, input.endCol);
    if(success){
      $(document).trigger('displayTurnsPassed', ++turns);
    }
  }
}