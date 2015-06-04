// Preset for the Clockwork engine
// Arcadio Garcia Salvadores

//See http://rjs.azurewebsites.net/ for the original example

var W10API = W10API  ||[];
W10API.push({
    name: "notificationManager",
    events: [
        {
            name: "notificationToast", code: function (event) {

                if (typeof Windows != 'undefined') {
                    var notifications = Windows.UI.Notifications;
                    //Get the XML template where the notification content will be suplied
                    var template = notifications.ToastTemplateType.toastText02;
                    var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
                    //Supply the text to the XML content
                    var toastTextElements = toastXml.getElementsByTagName("text");
                    toastTextElements[0].appendChild(toastXml.createTextNode(event.title));
                    toastTextElements[1].appendChild(toastXml.createTextNode(event.message));
                    //Specify a long duration
                    var toastNode = toastXml.selectSingleNode("/toast");
                    toastNode.setAttribute("duration", "long");
                    //Specify the audio for the toast notification
                    var audio = toastXml.createElement("audio");
                    audio.setAttribute("src", "ms-winsoundevent:Notification.IM");
                    //Specify launch paramater
                    toastXml.selectSingleNode("/toast").setAttribute("launch", event.launch);
                    //Create a toast notification based on the specified XML
                    var toast = new notifications.ToastNotification(toastXml);
                    //Send the toast notification
                    var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
                    toastNotifier.show(toast);

                }

            }
        }
    ]
});

