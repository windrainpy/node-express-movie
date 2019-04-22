$(function() {
    $('#doubanInput').blur(function() {
        var id = $(this).val()

        if(id) {
            $.ajax({
                url: `https://api.douban.com/v2/movie/subject/${id}`,
                type: 'get',
                dataType: 'jsonp',
                crossDomain: true,
                cache: true,
                jsonp: 'callback',
                success(data) {
                    $('#title').val(data.title)
                    $('#year').val(data.year)
                    $('#doctory').val(data.directors[0].name)
                    $('#country').val(data.countries[0])
                    $('#poster').val(data.images.large)
                    // $('#language').val(data.)
                    // $('#flash').val(data.)
                    $('#summary').val(data.summary)
                }
            })
        }
    })

    $('#customCategoryRadio').click(function() {
        $('[name="movie[category]"]').prop('checked', false)
    })

    $('[name="movie[category]').click(function() {
        $('#customCategoryRadio').prop('checked', false)
    })
})