var cms_key = null;

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
function GetKeyCMS() {
    $.ajax({
        type: 'POST',
        data: '',
        contentType: 'application/json',
        url: '/getkeyCMS',
        success: function (data) {
            cms_key = data;
        }
    });
}
//GetKeyCMS();
function Login() {
    $.ajax({
        type: 'GET',
        data: {},
        contentType: 'application/json',
        url: '/getkeyCMS',
        success: function (data) {
            cms_key = data;
            var psid = getUrlParameter('psid');
            if (psid == '') return alert('Mời bạn sử dụng chatbot để lấy đường dẫn đăng nhập và mã otp mới');
            var provincial = getUrlParameter('provincial');
            var txtUsername = document.getElementById("txtUsername");
            if (txtUsername.value === null || txtUsername.value === undefined || txtUsername.value === "") { alert("Vui lòng nhập OTP"); return; }
            var objUser = {};
            objUser.OTP = txtUsername.value;
            objUser.psid = psid;
            console.log(objUser);
            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(objUser), cms_key).toString();
            var dataEncrypt = { data: ciphertext };
            $.ajax({
                type: 'POST',
                data: JSON.stringify(dataEncrypt),
                contentType: 'application/json',
                url: '/unitloginCMS',
                success: function (data) {
                    if (data.success == "true") {
                        window.location.href = '/report';
                    }
                    else {
                        //window.location.reload();
                        alert(data.message);
                    }
                }
            });
        }
    });
}

function runScript(e) {
    //See notes about 'which' and 'key'
    if (e.keyCode == 13) {
        Login();
    }
}
