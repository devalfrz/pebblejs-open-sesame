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

var lockitron_ip = '192.168.1.11';
var lights_ip = '192.168.1.10';

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

var main = new UI.Card({
  title: 'Open Sesame',
  body: 'Up = Open\nDown = Close\nSelect = Toggle Lights',
  subtitleColor: 'indigo',
  bodyColor: '#9a0036'
});
main.on('click', 'down', function(e){goodBye(e)});
main.on('click', 'up', function(e){welcome(e)});
main.on('click', 'select', function(e){toggleLights(e)});
main.on('click', 'back', function(e){exitApp(e)});
main.show();

var card = new UI.Card({
  subtitleColor: 'indigo',
  bodyColor: '#9a0036'
});
card.on('click', 'down', function(e){goodBye(e)});
card.on('click', 'up', function(e){welcome(e)});
card.on('click', 'select', function(e){toggleLights(e)});
card.on('click', 'back', function(e){exitApp(e)});

var exitApp = function(e){
  card.hide(); 
  main.hide();
}

var goodBye = function(e){
  card.title('Good Bye!');
  card.subtitle('Closing...');
  card.body('');
  card.show();
  applianceAction(
    'http://'+lockitron_ip+'/arduino/',
    'lock',
    applianceAction(
      'http://'+lights_ip+'/arduino/',
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
    'http://'+lockitron_ip+'/arduino/',
    'arduino',
    applianceAction(
      'http://'+lights_ip+'/arduino/',
      'lights-on',
      function(e){
        card.subtitle('Unlocked!');
        card.body("There's no place like 127.0.0.1");
        card.show();
        window.setTimeout(function(e){
          applianceAction(
            'http://'+lockitron_ip+'/arduino/',
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
  card.subtitle('...');
  card.body('');
  card.show();
  applianceAction(
    'http://'+lights_ip+'/arduino/',
    'lights-toggle',
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
