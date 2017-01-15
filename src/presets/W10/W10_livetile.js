// Preset for the Clockwork engine
// Arcadio Garcia Salvadores

//  liveTile preset
//  ------------------ 
//  events => "pushTile"
//            Creates a new live tile
//            Parameters:
//              -event.title            String containing the live tile title
//              -event.text             String containing the live tile text
//              -event.image            String containing the url of the live tile image
//              -event.wideimage        String containing the url of the wide live tile image
//              -event.bigimage        String containing the url of the wide live tile image
//              -event.date (optional)  Date object containing the expiration time of the tile
//  ------------------

var W10API = W10API || [];
W10API.push({
    name: "liveTile",
    events: [
        {
            name: "pushTile", code: function (event) {

                if (typeof Windows !== 'undefined') {
                    var notifications = Windows.UI.Notifications;

                    //Square tile
                    var template = notifications.TileTemplateType.TileSquare150x150PeekImageAndText02;
                    var tileXml = notifications.TileUpdateManager.getTemplateContent(template);

                    var tileTextAttributes = tileXml.getElementsByTagName("text");
                    tileTextAttributes[0].appendChild(tileXml.createTextNode(event.title));
                    tileTextAttributes[1].appendChild(tileXml.createTextNode(event.text));

                    var tileImageAttributes = tileXml.getElementsByTagName("image");
                    tileImageAttributes[0].src = event.image;

                    var tileNotification = new notifications.TileNotification(tileXml);

                    tileNotification.expirationTime = event.date || new Date("July 30, 2095 12:34:56");

                    notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);
                
                    //Wide tile
                    template = notifications.TileTemplateType.TileWide310x150PeekImage01;
                    tileXml = notifications.TileUpdateManager.getTemplateContent(template);

                    tileTextAttributes = tileXml.getElementsByTagName("text");
                    tileTextAttributes[0].appendChild(tileXml.createTextNode(event.title));
                    tileTextAttributes[1].appendChild(tileXml.createTextNode(event.text));

                    tileImageAttributes = tileXml.getElementsByTagName("image");
                    tileImageAttributes[0].src = event.wideimage;

                    tileNotification = new notifications.TileNotification(tileXml);

                    tileNotification.expirationTime = event.date || new Date("July 30, 2095 12:34:56");

                    notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);
                    
                    
                    //Big tile
                    template = notifications.TileTemplateType.TileSquare310x310ImageAndTextOverlay03;
                    tileXml = notifications.TileUpdateManager.getTemplateContent(template);

                    tileTextAttributes = tileXml.getElementsByTagName("text");
                    tileTextAttributes[0].appendChild(tileXml.createTextNode(event.title));
                    tileTextAttributes[1].appendChild(tileXml.createTextNode(event.text));

                    tileImageAttributes = tileXml.getElementsByTagName("image");
                    tileImageAttributes[0].src = event.bigimage;

                    tileNotification = new notifications.TileNotification(tileXml);

                    tileNotification.expirationTime = event.date || new Date("July 30, 2095 12:34:56");

                    notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);
                }


            }
        }
    ]
});

