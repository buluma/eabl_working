var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //app.receivedEvent('deviceready');
        document.addEventListener('backbutton', function(e){
            e.preventDefault();
            //navigator.app.exitApp();
            navigator.notification.confirm(
                'Are You Sure You want to exit?',  // message
                onConfirmExit,                // callback to invoke with index of button pressed
                'Confirm Exit',            // title
                'No,Exit'          // buttonLabels
            );

        }, false);
    
    },

};


app.initialize();