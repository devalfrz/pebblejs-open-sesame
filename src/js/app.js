/**
 * Pebble.js Open Sesame
 *
 * Simple App for managing illumination and home security using
 * the Pebble.
 * 
 * This project requires the installation of Arduino Yun and Lockitron
 * hardware. The source of this is located in:
 * 
 * https://github.com/devalfrz/arduino-yun-lights
 * https://github.com/devalfrz/arduino-yun-lockitron
 *
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

var main = new UI.Card({
  title: 'Open Sesame',
  body: 'Up = Open\nDown = Close\nSelect = Toggle Lights',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});

main.show();
main.on('click', 'down', function(e){
  goodBye(e);
});
main.on('click', 'up', function(e){
  welcome(e);
});
main.on('click', 'select', function(e){
  toggleLights(e);
});

var card = new UI.Card({
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});
card.on('click', 'down', function(e){
  goodBye(e);
});
card.on('click', 'up', function(e){
  welcome(e);
});
card.on('click', 'select', function(e){
  toggleLights(e);
});



var goodBye = function(e){
  card.title('Good Bye!');
  card.subtitle('Closing...');
  card.body('');
  card.show();
  applianceAction(
    'http://192.168.1.72/arduino/',
    'lock',
    applianceAction(
      'http://192.168.1.67/arduino/',
      'lights-off',
      function(e){
        card.subtitle('Locked!');
        card.body("See you soon!");
        card.show();
      },
      function(e){
        card.body('Error turning on the lights.');
        card.show();
      }
    ),
    function(e){
      card.body('Error opening door.');
      card.show();
    }
  );
  
}

var welcome = function(e){
  card.title('Welcome!');
  card.subtitle('Opening...');
  card.body('');
  card.show();
  applianceAction(
    'http://192.168.1.72/arduino/',
    'arduino',
    applianceAction(
      'http://192.168.1.67/arduino/',
      'lights-on',
      function(e){
        card.subtitle('Unlocked!');
        card.body("There's no place like 127.0.0.1");
        card.show();
        window.setTimeout(function(e){
          applianceAction(
            'http://192.168.1.72/arduino/',
            'lock',
            function(e){
              card.subtitle("Locked!");
              card.show();
            },
            function(){
              card.subtitle("Error locking door again.");
              card.show();
            })
          },15000
        );
      },
      function(e){
        card.body('Error turning on the lights.');
        card.show();
      }
    ),
    function(e){
      card.body('Error opening door.');
      card.show();
    }
  );
}


var toggleLights = function(e){
  card.title('Toggle Lights');
  card.subtitle('Getting status...');
  card.show();
  applianceAction(
    'http://192.168.1.67/arduino/',
    'status',
    function(e){
      e = (typeof(e) == 'string') ? JSON.parse(e) : e;
      if(e.state){
        card.subtitle('Turning On...');
        var action = 'lights-on';
      }else{
        card.subtitle('Turning Off...');
        var action = 'lights-off';
      }
      card.show();
      applianceAction(
        'http://192.168.1.67/arduino/',
        action,
        function(e){
          e = (typeof(e) == 'string') ? JSON.parse(e) : e;
          if(e.state){
            card.subtitle('Lights are Off');
          }
          else{
            card.subtitle('Lights are On');
          }
          card.show();
        },
        function(e){
          card.subtitle('Error');
          card.show();
        }
      );
    },
    function(e){
      card.subtitle('Error');
      card.show();
    }
  );
}


var applianceAction = function(url,action,successCallback,errorCallback){
  ajax({
    url:url+action,
    //type: 'json',    
  },function(data){
    successCallback(data);
  },function(error){
    errorCallback(error);
  }
  );

}


/*
main.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});

main.on('click', 'select', function(e) {
  var wind = new UI.Window({
    fullscreen: true,
  });
  var textfield = new UI.Text({
    position: new Vector2(0, 65),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Text Anywhere!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});
*/


main.on('click', 'down', function(e){
  goodBye(e);
});
main.on('click', 'up', function(e){
  welcome(e);
});
main.on('click', 'select', function(e){
  toggleLights(e);
});

