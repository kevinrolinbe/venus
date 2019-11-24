function venusFileManager({
                            selector,
                            urlGetList,
                            urlPostFile,
                            urlDeleteFile,
                            urlCreateFolder,
                            urlDeleteFolder,
                            enableCreateFolder=true,
                            enableUploadFile=true,
                            enableDeleteFile=true,
                            callbackSelect=null
                          }) {
  console.log( callbackSelect );
  var
    textDrop = "Drop files here!",
    textCreateFolder = "Create folder",
    textUploadFile = "Upload file",
    textRefresh = "Refresh",
    textListRowHeaderName = "Name",
    textListRowHeaderDate = "Date",
    textListRowHeaderType = "Type",
    textListRowHeaderSize = "Size";

    //DRAW
    var html = '';
    html+=
      '<div class="venus-filemanager-dropzone"><div class="venus-filemanager-dropzone-content"><span>'+textDrop+'</span></div></div>'+
      '<div class="venus-filemanager-messagezone"><div class="venus-filemanager-messagezone-content"><div>Message test</div></div></div>'+
      '<table class="venus-filemanager-table"><tr>'+
      '<td class="venus-filemanager-folders"><ul><li data-id="1" data-foldername="server"><i class="fas fa-server"></i>Server</li></ul></td>'+
      '<td class="venus-filemanager-files">'+

      '<div class="venus-filemanager-toolbar">';
    if( enableCreateFolder ){
      html+=
        '  <a href="#" class="venus-filemanager-createfolder"><i class="fas fa-folder"></i>'+textCreateFolder+'</a>';
    }
    if( enableUploadFile ){
      html+=
        '  <a href="#" class="venus-filemanager-uploadfile"><i class="fas fa-file-upload"></i>'+textUploadFile+'</a>';
    }
    html+=
      '  <a href="#" class="venus-filemanager-refresh"><i class="fas fa-sync-alt"></i>'+textRefresh+'</a>'+
      '</div>'+

      '<div class="venus-filemanager-list">'+
      '  <div class="venus-filemanager-list-row header">'+
      '    <div class="venus-filemanager-list-row-col name"><p>'+textListRowHeaderName+'</p></div>'+
      '    <div class="venus-filemanager-list-row-col date"><p>'+textListRowHeaderDate+'</p></div>'+
      '    <div class="venus-filemanager-list-row-col type"><p>'+textListRowHeaderType+'</p></div>'+
      '    <div class="venus-filemanager-list-row-col size"><p>'+textListRowHeaderSize+'</p></div>'+
      '    <div class="venus-filemanager-list-row-col actions">&nbsp;</div>'+
      '  </div>'+
      '</div>'+

      '</tr></table>'+
      '<form><input type="file" class="venus-filemanager-input"/></form>';
    $(selector)
      .html( html )
      .addClass('customFileManager');

    var
      currentFolder = 1,
      filesArray = [];

    function resetList(){
      $.ajax({
        url : urlGetList,
        type : 'POST',
        data : null,
        processData: false,  // tell jQuery not to process the data
        contentType: false,  // tell jQuery not to set contentType
        success : function(data) {
          //console.log( 'json', data['list']);
          venusFilemanagerLoad( data['list'] );
        }
      });
  }
  resetList();

  function venusFilemanagerLoad(json){
    json = jsonToArray(json);

    $(selector+' td.venus-filemanager-folders ul').html(
      venusFilemanagerLoadFolderList(json)
    );

    $(selector+' td.venus-filemanager-folders li').each(function(){
      $(this).unbind().click(function(e){
        e.stopPropagation();

        // reinitialise les folders
        $(selector+' td.venus-filemanager-folders li')
          .removeClass('current')
          .removeClass('show');
        $(selector+' td.venus-filemanager-folders li i')
          .removeClass('fa-folder-open')
          .addClass('fa-folder');

        // on set le current folder
        $(this)
          .addClass('current')
          .addClass('show');

        // on modifie l'affichage des parents
        $(this).parents('li').addClass('show');

        $(selector+' td.venus-filemanager-folders li.show').children('i')
          .removeClass('fa-folder')
          .addClass('fa-folder-open');

        currentFolder = $(this).data('id');
        venusFilemanagerLoadFileList(currentFolder);
      });
    });

    $(selector+' li[data-id="'+currentFolder+'"]').click();
  }

  function venusFilemanagerLoadFolderList(json){
    json = jsonToArray(json);

    filesArray[json['id']] = json['files'];

    var html = '';
    html+= '<li data-id="'+json['id']+'">'
    if(json['id']=='1'){
      html+= '<i class="fas fa-server"></i>'+json['name'];
    }else{
      html+= '<i class="far fa-folder"></i>'+json['name'];
    }
    html+= '<ul>';
    for( var i=0; i<json['childrens'].length; i++){
      html+= venusFilemanagerLoadFolderList(json['childrens'][i]);
    }
    html+= '</ul>';
    html+='</li>';

    return html;
  }

  function venusFilemanagerLoadFileList(id){
    id = id+'';

    $(selector+' td.venus-filemanager-files .venus-filemanager-list .venus-filemanager-list-row').each(function(e){
      if( !$(this).hasClass('header') ){
        $(this).remove();
      }
    });

    var
      files = filesArray[id],
      html = '';
    for( var j=0; j<files.length; j++){
      html+='<div class="venus-filemanager-list-row" data-id="'+files[j]['id']+'" data-name="'+files[j]['name']+'" data-namefull="'+files[j]['nameFull']+'" data-relativepath="{{ app.request.getSchemeAndHttpHost() }}'+files[j]['webPath']+'" data-absolutepath="'+files[j]['webPath']+'">';
      html+='<div class="venus-filemanager-list-row-col name"><p>'+files[j]['name']+'</p></div>';
      html+='<div class="venus-filemanager-list-row-col date"><p>'+files[j]['date']+'</p></div>';
      html+='<div class="venus-filemanager-list-row-col type"><p>'+files[j]['type']+'</p></div>';
      html+='<div class="venus-filemanager-list-row-col size"><p>'+files[j]['size']+'</p></div>';
      html+='<div class="venus-filemanager-list-row-col actions"><p>';
      html+='<a href="#" class="link"><i class="fas fa-link"></i><input value="{{ app.request.getSchemeAndHttpHost() }}'+files[j]['webPath']+'"></a>';
      //html+='<a href="#" class="edit"><i class="fas fa-pencil-alt"></i></a>';
      if( enableDeleteFile ){
        html+='<a href="#" class="delete"><i class="fas fa-trash-alt"></i></a>';
      }
      html+='</p></div>';
      html+='</div>';
    }
    $(selector+' td.venus-filemanager-files .venus-filemanager-list').append(html);

    return false;
  }

  //CREATEFOLDER
  $(".venus-filemanager-createfolder").click(function(e){
    e.preventDefault();

    var folderName = prompt("Nom du nouveau dossier ?");

    if( folderName != null && folderName != "" ){
      var formData = new FormData();
      formData.append('folderId', currentFolder);
      formData.append('name', folderName);

      $.ajax({
        url : urlCreateFolder,
        type : 'POST',
        data : formData,
        processData: false,  // tell jQuery not to process the data
        contentType: false,  // tell jQuery not to set contentType
        success : function(data) {
          //console.log(data);
          currentFolder = data['id'];
          resetList();
        }
      });
    }//if( folderName != "" ){
  });

  //UPLOAD
  $(".venus-filemanager-uploadfile").click(function(e){
    e.preventDefault();
    $('.venus-filemanager-input').click();
  });
  //UPLOAD - DROP
  var dragTimer;
  $(document)
    .on('drop', function(e) {
      e.preventDefault();

      var file = e.originalEvent.dataTransfer.files[0];
      $(".venus-filemanager-input").prop("files", e.originalEvent.dataTransfer.files);

      hideDropzone();
    })
    .on('dragover', function(e) {
      e.preventDefault();

      var dt = e.originalEvent.dataTransfer;
      if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.contains('Files'))) {
        $(".venus-filemanager-dropzone").show();
        window.clearTimeout(dragTimer);
      }
    })
    .on('dragleave', function(e) {
      hideDropzone();
    });
  function hideDropzone(){
    dragTimer = window.setTimeout(function() {
      $(".venus-filemanager-dropzone").hide();
    }, 25);
  }
  // UPLOAD - detect input change
  var uploadCount = 0;
  $('.venus-filemanager-input').change(function(e){
    console.log('input change');

    var files = $(this).get(0).files;
    uploadCount+= files.length;
    for (var i = 0; i < files.length; ++i) {
      console.log( files[i].name );

      var formData = new FormData();
      formData.append('file', $(this).get(0).files[i]);
      formData.append('folderId', currentFolder);

      $.ajax({
        url : urlPostFile,
        type : 'POST',
        data : formData,
        processData: false,  // tell jQuery not to process the data
        contentType: false,  // tell jQuery not to set contentType
        success : function(data) {
          //console.log(data);
          uploadCount--;

          if( uploadCount == 0 ){
            console.log('upload end');
            resetList();
          }
        }
      });
    }

    $('.venus-filemanager-input').val();
  });

  // Refresh
  $(".venus-filemanager-refresh").click(function(e){
    e.preventDefault();
    resetList();
  });

  //Copy link
  $(document)
    .off('click', selector+' .venus-filemanager-list-row .venus-filemanager-list-row-col.actions a.link')
    .on('click', selector+' .venus-filemanager-list-row .venus-filemanager-list-row-col.actions a.link', function(e) {
      e.preventDefault();
      e.stopPropagation();

      $(this).children('input').select();
      document.execCommand("copy");

      $(selector+' .venus-filemanager-messagezone .venus-filemanager-messagezone-content div').html('<p>Link copied !</p>');
      $(selector+' .venus-filemanager-messagezone')
        .fadeIn()
        .fadeOut(2000);
    });

  //Delete
  $(document)
    .off('click', selector+' .venus-filemanager-list-row-col.actions a.delete')
    .on('click', selector+' .venus-filemanager-list-row-col.actions a.delete', function(e) {
      e.preventDefault();
      e.stopPropagation();

      var $row = $(this).closest('.venus-filemanager-list-row');
      var name = $row.children('.name').children('p').html();

      var html="";
      html+='<p>Êtes-vous certain de vouloir suprimer le fichier ?</p>';
      html+='<p style="text-align:center;"><strong>'+name+'</strong></p>';
      html+='<div style="text-align:center;"><input type="text" placeholder="delete" id="venus-filemanager-messagezone-input" data-id="'+$row.data('id')+'" /></div>';
      html+='<div style="text-align:center;"><button id="venus-filemanager-messagezone-confirm">Confirm</button>&nbsp;&nbsp;<button id="venus-filemanager-messagezone-cancel">Cancel</button></div>';

      $(selector+' .venus-filemanager-messagezone .venus-filemanager-messagezone-content div').html(html);
      $(selector+' .venus-filemanager-messagezone')
        .fadeIn();
    });
  // Delete Cancel
  $(document).on('click', selector+' .venus-filemanager-messagezone #venus-filemanager-messagezone-cancel', function(e) {
    e.preventDefault();
    $(selector+' .venus-filemanager-messagezone')
      .fadeOut();
  });
  // Delete Confirm
  $(document).on('click', selector+' .venus-filemanager-messagezone #venus-filemanager-messagezone-confirm', function(e) {
    e.preventDefault();
    $(selector+' .venus-filemanager-messagezone #venus-filemanager-messagezone-input').removeClass('error');

    if( $(selector+' .venus-filemanager-messagezone #venus-filemanager-messagezone-input').val() == "delete" ){
      var id= $(selector+' .venus-filemanager-messagezone #venus-filemanager-messagezone-input').data('id');

      var formData = new FormData();
      formData.append('id', id);
      $.ajax({
        url : urlDeleteFile,
        type : 'POST',
        data : formData,
        processData: false,  // tell jQuery not to process the data
        contentType: false,  // tell jQuery not to set contentType
        success : function(data) {
          if( data['status']=='OK' ){
            $(selector+' .venus-filemanager-messagezone .venus-filemanager-messagezone-content div').html('<p>File deleted !</p>');
            $(selector+' .venus-filemanager-messagezone')
              .fadeOut(2000);
            resetList();
          }
        }
      });
    }else{
      $(selector+' .venus-filemanager-messagezone #venus-filemanager-messagezone-input').addClass('error');
    }

  });

  // callback select
  if( callbackSelect != null ){
    $(document).on('dblclick', selector+' .venus-filemanager-list-row', function(e) {
      e.preventDefault();
      var fnstring = callbackSelect;
      var fnparams = [{
        id: $(this).data('id'),
        name: $(this).data('name'),
        namefull: $(this).data('namefull'),
        absolutePath: $(this).data('absolutepath'),
        relativePath: $(this).data('relativepath')
      }];
      var fn = eval(fnstring);
      if (typeof fn === "function") fn.apply(null, fnparams);
    });
  }
}



function jsonToArray(json){
  var array = [];
  try {
    array = JSON.parse(json);
  } catch (e) {
    array = json;
  }
  return array;
}