$(document).ready(function(){
    // let's hide the stores link
    var homeinfo = '<div class="app-info thumbnail">';
    homeinfo +='<a href="#" class="home-info label-warning" data-toggle="modal" data-target="#userModal">';
    homeinfo +='  <div class="valign"><span class="icon icon-user big-icon"></span> <h4> '+fullname+ '</h4></div>';
    homeinfo +='</a>';
    homeinfo +='<a href="#" class="home-info label-info">';
    homeinfo +='  <div class="valign"><span class="icon icon-calendar big-icon"></span><h4> '+getTodaysDate()+' </h4></div>';
    homeinfo +='</a>';
    homeinfo +='</div>';
    homeinfo +='<div class="thumbnail">';

    homeinfo +='<a href="stores.html">';
    homeinfo +=' <button class="btn btn-primary btn-block" type="button"><span class="badge big-badge" id="openStoreCount"></span> <h4>My Managed Outlets</h4></button>';
    homeinfo +='</a>';

    homeinfo +='</div>';
//    homeinfo +='<div class="thumbnail">'; hide callage
//    homeinfo +='<a href="callage.html">';
//    homeinfo +=' <button class="btn btn-secondary btn-block" type="button"><span class="glyphicon glyphicon-stats big-icon"></span><h4>Callage</h4></button>';
//    homeinfo +='</a>';
//    homeinfo +='</div>';
    homeinfo +='<div class="thumbnail">';
    homeinfo +='<a href="route.html">';
    homeinfo +='  <button class="btn btn-info btn-block" type="button"><span class="glyphicon glyphicon-road big-icon"></span> <h4>Weekly Planner</h4></button>';
    homeinfo +='</a>';
    homeinfo +='</div>';

    homeinfo +='<div class="thumbnail">';
    homeinfo +='<a href="outlet.html">';
    homeinfo +='  <button class="btn btn-secondary btn-block" type="button"><span class="glyphicon glyphicon-map-marker big-icon"></span> <h4>Outlet Manager</h4></button>';
    homeinfo +='</a>';
    homeinfo +='</div>';

    /*homeinfo +='<div class="thumbnail">';
    homeinfo +='<a href="daily.html">';
    homeinfo +='  <button class="btn btn-warning btn-block" type="button"><span class="glyphicon glyphicon-road big-icon"></span> <h4>Daily Action Planner</h4></button>';
    homeinfo +='</a>';
    homeinfo +='</div>';*/


    // if (assigned == 'team-leader'){
    //     homeinfo +='<div class="thumbnail">';
    //     homeinfo +='<a href="tasks.html">';
    //     homeinfo +='  <button class="btn btn-danger btn-block" type="button"><span class="glyphicon glyphicon-list-alt big-icon"></span> <h4>Weekly Objectives</h4></button>';
    //     homeinfo +='</a>';
    //     homeinfo +='</div>';
    // }

    homeinfo +='<div class="thumbnail">';
    homeinfo +='<a href="sync.html">';
    homeinfo +='  <button class="btn btn-success btn-block" type="button"><span class="icon icon-loop2 big-icon"></span> <h4>Data Synchronization</h4></button>';
    homeinfo +='</a>';
    // user is not known
    if (userobj.is_promoter == 'undefined') {
        //$('a#syncpagelink').addClass('hidden'); // hide the sync
    }
    homeinfo +='</div>';
    $('#apphome').append(homeinfo);
    countStores();

});

$(document).ready(function() {
    var modaluserinfo = '<ul class="list-group">';
    // modaluserinfo += '<li class="list-group-item">';
    // modaluserinfo += ' <h4><strong>User ID: </strong></h4>';
    // modaluserinfo += '<p>'+userobj.userid+'</p>';
    // modaluserinfo += '</li>';
    modaluserinfo += '<li class="list-group-item">';
    modaluserinfo += '  <h4><strong>Username: </strong><h4>';
    modaluserinfo += '<p>'+username+'</p>';
    modaluserinfo += '</li>';
    modaluserinfo += '<li class="list-group-item">';
    modaluserinfo += '  <h4><strong>Full Name: </strong><h4>';
    modaluserinfo += '<p>'+fullname+'</p>';
    modaluserinfo += '</li>';
    modaluserinfo += '<li class="list-group-item">';
    modaluserinfo += '  <h4><strong>User Email: </strong><h4>';
    modaluserinfo += '<p>'+useremail+'</p>';
    modaluserinfo += '</li>';
    modaluserinfo += '<li class="list-group-item">';
    modaluserinfo += '  <h4><strong>Last Login: </strong><h4>';
    modaluserinfo += '<p class="small">'+userlastlogin+'</p>';
    modaluserinfo += '</li>';
    modaluserinfo += '</ul>';

    $('button#btnlogout').on('click', function(){
        logOutUser();
    });

	$('#userModal').on('show.bs.modal', function (event) {
        var modal = $(this);
        modal.find('.modal-body').html(modaluserinfo);
    });

});
