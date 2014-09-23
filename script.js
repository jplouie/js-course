// Intro to basic constructor functions
function Bell(soundUrl, imgUrl) {
  var _this = this;
  var img_id = imgUrl.replace(/[^\w\s]/gi, '');
  var $view = $('<div><img src=' + imgUrl + '><div id=' + img_id + ' class="fuse"></div></div>').click(function(){
    _this.delayedRing();
  });

  $('body').append($view);

  this.sound = new Howl({
    urls: [soundUrl]
  });

  this.ring = function(callback) {
    // You'll need to define this.sound
    this.sound.play();
    if (callback) {
      callback();
    }
  };

  this.delayedRing = function(callback){
  var num = 1000 + Math.floor(Math.random() * 5000);
    $('#' + img_id).css({
      'background-color': 'red',
      'height': '20px',
      'width': '100%'
    }).animate({'width': '0%'}, num);

    window.setTimeout(function(){
      _this.ring();
      if(callback){
        callback();
      }
    }, num);
  };
}

// Instantiation code goes here. Example:
var gong = new Bell('sounds/gong.mp3', 'img/gong.jpg');
var bell = new Bell('sounds/bell.mp3', 'img/bell.jpg');
var cowbell = new Bell('sounds/cowbell.mp3', 'img/cowbell.jpg');
var doorbell = new Bell('sounds/doorbell.mp3', 'img/doorbell.jpg');
var deskbell = new Bell('sounds/deskbell.mp3', 'img/deskbell.jpg');

var addButtons = function(){
  $('body').append('<button id="button1" type="button">Click Me</button>');
  $('#button1').after('<button id="button2" type="button" disabled>Sequence 2</button>');
}

addButtons();

$('#button1').click(function(){
  // deskbell.ring(doorbell.ring(bell.ring(gong.ring(cowbell.ring()))));
  deskbell.delayedRing(function(){
    doorbell.delayedRing(function(){
      bell.delayedRing(function(){
        gong.delayedRing(function(){
          cowbell.delayedRing(function(){
            $('#button2').removeAttr('disabled');
          });
        });
      });
    });
  });
});

$('#button2').click(function(){
  gong.delayedRing(function(){
    cowbell.delayedRing(function(){
      deskbell.delayedRing(function(){
        doorbell.delayedRing(function(){
          bell.delayedRing();
        });
      });
    });
  });
});


