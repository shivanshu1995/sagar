var category = 1;
$(document).ready(() => {

$('#addCategory').click((e) => {
    e.preventDefault()
    $('#serviceDetails').append('<div id="category_'+category+'"><input type="text" name="category_'+category+'" placeholder="category name" ><button id="removeCategory">Remove a Category</button><button id="addSubcategory">Add a SubCategory</button></div><br>');
    category+=1;
    });
$('body').on('click','#addSubcategory',function(e){
    e.preventDefault()
    var category = $(this).parent('div').attr('id');
    var category_num = category.slice(9);
    var subcategory = $('#'+category+' div').length;
    subcategory+=1;
   $(this).parent('div').append('<div id="subcategory_'+category_num+'_'+subcategory+'"  ><input type="text" name="subcategory_'+category_num+'_'+subcategory+'" placeholder="Add Subcategory"><input type="number" name="price_'+category_num+'_'+subcategory+'"placeholder="price"><button id="removeSubcategory">Remove Subcategory</button></div>');
});
$('body').on('click','#removeCategory',function(e){
    e.preventDefault()
   $(this).parent('div').remove();
});
$('body').on('click','#removeSubcategory',function(e){
    e.preventDefault()
   $(this).parent('div').remove();
});

});