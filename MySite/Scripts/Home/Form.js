

function From_OnClickQue() {
    $('#markQue').show();
    $('#markTodo').hide();
    $('#markFedb').hide();
}
function From_OnClickTodo() {
    $('#markQue').hide();
    $('#markTodo').show();
    $('#markFedb').hide();
}
function From_OnClickFedb() {
    $('#markQue').hide();
    $('#markTodo').hide();
    $('#markFedb').show();
}

function Form_CountStr(val) {
    $('#strCountStr').text(val);
}

function Form_SubmitOnClick() {
    var switchValue = $('input[name="main"]:checked').val();
    var result = "";
    if ($('#email').val() == '') {
        result += 'Заполните E-mail!<br/>'
    }
    if ($('#nameQu').val() == '') {
        result += 'Заполните Ваш псевдоним!<br/>'
    }

    switch (switchValue) {

        //отзыв
        case "fedb":
            if (result != "") {
                if ($('#txtAreaFedb').text() == '') {
                    result += 'Заполните текст отзыва!<br/>'
                }

            }
            else {
                $('#messText').text('Ваш отзыв получен!');
                $('#liveToast').show();
            }
            break;
        //Предложение
        case "todo":
            if (result != "") {
                if ($('#txtAreaTodo').text() == '') {
                    result += 'Заполните текст предложения!<br/>'
                }

            }
            else {
                $('#messText').text('Ваше предложение получено!');
                $('#liveToast').show();
            }
            break;
        //Вопрос
        case "que":
            if (result != "") {
                if ($('#txtAreaQue').text() == '') {
                    result += 'Заполните текст вопроса!<br/>'
                }

            }
            else {
                $('#messText').text('Ваш вопрос получен!');
                $('#liveToast').show();
            }
            break;


    }
    $('#messText').text('Ваш вопрос получен!');
    $('#liveToast').show();
    if (result != "") {
        $('#alertDiv').show();
        $('#alertDiv').append('<p>' + result + '</p>');
    }

}

