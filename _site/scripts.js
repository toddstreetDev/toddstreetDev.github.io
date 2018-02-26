var w = $(window)
var html = $('html')
var body = $('body')
var main = $('main')
var header = $('header')
var footer = $('footer')
var footerIcon = $('#footer-icon')
var section = $('section')
var firstSection = section.first()
var lastSection = section.last()
var navLogo = $('#nav-logo')
var message = $('#message')
var lb = $('#lightbox')
var lbi = $('#lightbox-image')
var lbb = $('#lightbox-bg')

//=========================================

$(document).ready(function(){

  if ($('.fade-on').length > 0){
    var divider = 3
    w.on('load', function(){
      $('.fade-on').each(function(){
        if ($(this).offset().top < w.height()){
          $(this).css({opacity: 1})
          $(this).removeClass('fade-on')
        }
      })

    });
    w.on('scroll', function(){
      var top = w.scrollTop()
      var height = w.height()
      var bottom = top + height
      $('.fade-on').each(function(){
        var thisTop = $(this).offset().top
        var thisBottom = thisTop + $(this).outerHeight()
        if ( thisBottom < bottom){
          var end = thisBottom + (height/divider)
          var opacity = (bottom - thisBottom)/(end - thisBottom)
          if (opacity >= 1){
            $(this).css({opacity: 1})
            $(this).removeClass('fade-on')
          } else {
            $(this).css({opacity: opacity})
          }
        }
      });
    })
  }

  function toggleNav(s){

    if (s == 'on'){
      html.addClass('fixed-header')
    } else if (s == 'off') {
      html.removeClass('fixed-header')
    } else {
      html.toggleClass('fixed-header')
    }
  };

  w.on('load', function(){
    if ($('#landing').length > 0){
      var userAgent = window.navigator.userAgent;
      if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
        $('#landing').addClass('mobile-padding')
      }
    }
  });

  w.on('scroll load',function(){
    var top = w.scrollTop()

    //toggle the nav to be fixed or not fixed
    if (top >= firstSection.offset().top){
      toggleNav('on')
    } else {
      toggleNav('off')
    }
  });

  //lightbox
  function lightboxOn(selectedImage){
    if (selectedImage.is('div')){
      var bg = selectedImage.css('background-image');
      bg = bg.replace('url(','').replace(')','').replace(/\"/gi, "");
    } else if (selectedImage.is('img')){
      bg = selectedImage.attr('src')
    }
    return bg
  }

  function lightboxNextImage(direction){
    var selectedImage = $('.lightbox-selected')
    selectedImage.removeClass('lightbox-selected')
    var images = $('.image')
    var index = images.index(selectedImage)

    if (direction == 'next'){
      var nextImage = $(images[index + 1])
      if (nextImage.length == 0){nextImage = $(images[0])}
    } else {
      var nextImage = $(images[index - 1])
      if (nextImage.length == 0){nextImage = $(images[images.length - 1])}
    }

    var bg = lightboxOn(nextImage)
    lbi.attr('src', bg)
    nextImage.addClass('lightbox-selected')
  };

  $('.image').on('click', function(){
    html.addClass('lightbox-on')
    $(this).addClass('lightbox-selected')
    var bg = lightboxOn($(this))
    lbi.attr('src', bg)
  })

  lbb.on('click', function(){
    $('.image').removeClass('lightbox-selected')
    html.removeClass('lightbox-on')
  })

  $('.lightbox-button').on('click', function(){
    if ($(this).hasClass('next')){
      lbClass = 'next'
    } else {
      lbClass = 'previous'
    }
    lightboxNextImage(lbClass)

  })

  //fade background image
  if ($('#landing').length > 0){
    var bg = $('#site-background')


    w.on('load scroll', function(){
      var top = w.scrollTop()
      var opacity = 1 - (top/1000)
      if(opacity < 0){opacity=0}
      bg.css("opacity", opacity)
    });
  };

  //gallery images
  if ($('.row-image').length > 0){
    w.on('load', function(){
      $('.row-image').each(function(){
        var img = $(this).children()
        var ratio = img.width() / img.height()
        $(this).css('flex', ratio + ' 1 0%')
      });
    })
  }

  //mobile job scroll2
  if ($('.job-container').length > 0){

    var job = $('.job-text-container')

    w.on('scroll resize load', function(){

      var width = window.innerWidth ? window.innerWidth : w.width();

      if(width < 800){

        var percent = 10

        var top = w.scrollTop()
        var height = window.innerHeight ? window.innerHeight : w.height();
        var bottom = top + height
        var middle = bottom - (height/2)
        var middleOffset = height/percent
        var middleAbove = middle - middleOffset
        var middleBelow = middle + middleOffset

        job.each(function(index){

          var item = $(this)
          var itemMiddle = item.offset().top + (item.outerHeight()/2)
          var opacity = 0
          var offset = 0

          if (itemMiddle <= bottom && itemMiddle > middleBelow){
              offset = itemMiddle - middleBelow
              opacity = 1 - (offset/(bottom - middleBelow))
          } else if ( itemMiddle >= top && itemMiddle < middleAbove){
              offset = middleAbove - itemMiddle
              opacity = 1 - (offset/(middleAbove - top))
          } else if( itemMiddle >= middleAbove && itemMiddle <= middleBelow){
              opacity = 1
          }

          $(this).css('opacity', opacity)

        });
      } else {
        job.css('opacity', '')
      }
    })
  };


  //blog page
  if($('#blog').length > 0){
    $('.post-button').on('click', function(){
      var blogContainer = $(this).parent().parent().parent()
      if ($(this).hasClass('post-open')){
        blogContainer.addClass('open-post')
      } else {
        blogContainer.removeClass('open-post')
        if(w.scrollTop() > blogContainer.offset().top ){
        w.scrollTop(blogContainer.offset().top - 80)
        }
      }
    });
  };

  //contact page
  if ($('#form').length > 0){
    var answer = $('.answer')
    var reason = $('#answer')

    answer.on('click', function(){
      if($(this).hasClass('active-answer')){
        $(this).removeClass('active-answer')
        reason.val('Not Specified')
      } else{
        $(this).parent('.form-row').children().removeClass('active-answer')
        $(this).addClass('active-answer')
        reason.val($(this).val())
      }

    })
  };

  //video
  if($('video').length > 0){

    $('video').bind('ended', function(e){
      var button = $(this).parent().children('.video-button')
      if (button.css('display', 'none')){
        button.fadeIn()
      }
    });

    $('.job-video').on('click', function(){
      var button = $(this).children('.video-button')
      var videoAsset = $(this).children('video')

      if (videoAsset.get(0).paused){
        videoAsset.get(0).play();
        button.fadeOut();
      } else {
        videoAsset.get(0).pause();
        button.fadeIn();
      }
    });
  };
  //footer mobile rainbow
  w.on('scroll', function(){
    if(w.width() <= 800){
      if(footerIcon.offset().top < w.scrollTop() + (w.height()/2)){
        footerIcon.addClass('footer-icon-on')
      } else {
        footerIcon.removeClass('footer-icon-on')
      }
    } else {
      footerIcon.removeClass('footer-icon-on')
    }
  });

  //laptop image scroll
  if ($('.laptop-image').length > 0){
    var laptopImage = $('.laptop-image')
    var laptop = laptopImage.parent()
    downTime = 10000
    upTime = 2000

    w.on('load resize', function(){
      laptopImage.stop(true, true)
      console.log('stopped')
      laptopImage.css('top', '0px')
      laptopBottom(downTime)
    });

    function laptopTop (time){
      var top = 0
      setTimeout(function(){
        laptopImage.animate(
          {top: top},{duration: time, complete: function(){laptopBottom(upTime)}}
        )
      }, 2000)
    }
    function laptopBottom (time){
      var top = 0 - (laptopImage.height() - laptop.height())
      setTimeout(function(){
        laptopImage.animate(
          {top: top},{duration: time, complete: function(){laptopTop(downTime)}}
        )
      }, 1000)
    }
  }


});
