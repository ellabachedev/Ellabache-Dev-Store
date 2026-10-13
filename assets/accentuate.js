Accentuate($("#customer_metafields"), function(data) { 
  console.log(data);
  if(data.status == 'OK'){
    $("#cus_notification").replaceWith('<p id="cus_notification" style="display:block;" class="form-success">Account details updated.</p>');
  }
  else{
    $("#cus_notification").replaceWith('<p id="cus_notification" style="display:block;" class="form-error">' + data.message +  '</p>');
  }
    $('.body-overlay').css('display', 'none');
	
});