$(function(){

    let categoryInput = $('#CategoryInput');
    let articleInput = $('#ArticleInput');
    let authorInput =$('#AuthorInput');
    let submitButton = $('#submitButton');
    submitButton.click(function (e) {
        e.preventDefault();
        console.log("clicked")

        let requestObject = {};

        requestObject.category = categoryInput.val();
        requestObject.article = articleInput.val();
        requestObject.auth = authorInput.val();

        let request= JSON.stringify(requestObject);
        console.log(request);

        $.ajax('/api/articles',{
            type: 'POST',
            data: request,
            dataType: 'json',
            contentType: 'application/json',
            success: function(result) {
                $('#PostSuccess').toggleClass('hidden');
                setTimeout(function () {
                    window.location.reload(true);
                }, 1000)

            }
        });

    })

});
