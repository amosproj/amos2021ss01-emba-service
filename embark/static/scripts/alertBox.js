 function  functionAlert(msg, myYes) {
    var confirmBox = $("#confirm");
    confirmBox.find(".message").text(msg);
    confirmBox.find(".yes").unbind().click(function() {
       confirmBox.hide();
    });
    confirmBox.find(".yes").click(myYes);
    confirmBox.show();
 }

 function alertBox(content,onDestroyfunction) {
   $.alert({
      title: 'Alert!',
      content: content,
      onDestroy: onDestroyfunction
    });
        
 }
 