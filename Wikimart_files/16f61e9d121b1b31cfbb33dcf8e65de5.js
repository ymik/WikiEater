;// header/search-query-sample.js


;(function($){$(function(){$('#search_query_sample a').click(function(e){$('#query_input').focus().val($(this).text());e.preventDefault();});});})(jQuery);

;// subscription-block.js



(function($){$(function(){$('.tongue').click(function(e){var $this=$(this);$this.closest('.subscription-block-inner').find('.wrapper-outer').slideToggle('fast');$this.toggleClass('not-active');$.cookie('is_subscription_visible',$this.hasClass('not-active')?0:1,{path:'/',domain:'all'});e.preventDefault();e.stopPropagation();});$('.subscribe-new-deals-email form').submit(function(e){var $element=$('.subscribe-new-deals-email');var $input=$('input[name=email]',$element);$input.removeClass('error');var tip=$input.data('qtip');if(tip)tip.destroy();$.ajax({url:'/ajax/call/subscription/subscribe/',type:'POST',data:$('.subscribe-new-deals-email form').serialize(),success:function(data){if(data.error){var errorMessage='Произошла ошибка, пожалуйста, попробуйте позднее';switch(data.error){case'EMAIL_IS_NOT_VALID':errorMessage='Введен некорректный адрес</br> электронной почты!';break;case'ALREADY_EXISTS':errorMessage='Этот адрес уже подписан!';break;case'TOO_FAST':errorMessage='Не многовато подписок для одного раза? Оставьте хоть что-то другим!';break;}
$input.addClass('error').qtip({content:errorMessage,position:{container:$element,my:'bottom left',at:'top left'},show:{ready:true}});}else{$input.removeClass('error').qtip({content:'Вы подписаны на рассылку уведомлений о супер-ценах, спасибо!',position:{container:$element,my:'bottom left',at:'top left'},show:{ready:true}});window.setTimeout(function(){$('.subscription-block').fadeOut(function(){$('.subscription-block').remove();})},3000);$(document.body).one('click',function(){var tip=$input.data('qtip');if(tip)tip.destroy();});$.cookie("is_subscription_block_disabled",1,{path:'/',domain:'all'});}}});e.preventDefault();});});})(jQuery);$(document).ready(function(){});

;// widgets/wmNotification.js



(function($){$.widget("ui.wmNotification",{options:{notifications:[],notificationTemplate:'<div class="notification-wrapper">'+'<div class="notification-close" title="Закрыть">&times;</div>'+'<div class="notification-decoration">%</div>'+'<div class="notification-content">{{html html}}</div>'+'</div>'},_init:function(){var $element=this.$element=$(this.element);if($element.data('wmNotificationInstance')!=null){return false;}
$element.data('wmNotificationInstance',this);window.setTimeout($.proxy(this._processNotifications,this),3000);},_processNotifications:function(){if($.isArray(this.options.notifications)&&this.options.notifications.length){var notification=this.options.notifications.splice(0,1);var $notification=this._renderNotificationBlock(notification);this._showNotification($notification);}},_renderNotificationBlock:function(notification){var $notification=$.tmpl(this.options.notificationTemplate,notification);$notification.find('.notification-close').click(this,this._closeNotification);return $notification;},_showNotification:function($notification){$notification.hide();var $visibleNotifications=$('body>.notification-wrapper');if($visibleNotifications.length){var $last=$visibleNotifications.last();$notification.css('top',($last.offset().top+$last.outerHeight()+5)+'px');}
$(document.body).append($notification);$notification.show('slide',$.proxy(this._processNotifications,this));},_closeNotification:function(){var $this=$(this);var $notification=$this.closest('.notification-wrapper');$notification.hide('slide',function(){$notification.remove();});}});})(jQuery);

