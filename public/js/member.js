//https://nongsanvn.herokuapp.com/getProductCMS

var datatable = $('#grvResult').DataTable({
    scrollY: 400,
    scrollX: true,
    scrollCollapse: true,
    select: true,
    dom: 'Bfrtip',
    buttons: [{
            extend: 'excelHtml5',
        },
        {
            extend: 'pdfHtml5',
        }
    ],
    ajax: {
        dataType: "json",
        url: "/getProvincialCount",
        // data: function (d) {

        //     var name = "";
        //     var provincial = "";
        //     var districts = "";
        //     var wards = "";
        //     if ($('#txtName').val() != "" && $('#txtName').val() != undefined)
        //         name = $("#txtName").val();
        //     if (cboProvincial.selectedIndex != 0)
        //         provincial = cboProvincial[cboProvincial.selectedIndex].text;
        //     if (cboDistricts.selectedIndex != 0)
        //         districts = cboDistricts[cboDistricts.selectedIndex].text;
        //     if (cboWards.selectedIndex != 0)
        //         wards = cboWards[cboWards.selectedIndex].text;

        //     d.name = name;
        //     d.provincial = provincial;
        //     d.districts = districts;
        //     d.wards = wards;
        //     d.psid = "";
        // },
        error: function (err) {
            if (err.responseText == 'Unauthorized') {
                alert("Bạn đã bị time out");
                window.location.href = 'login.html';
            }
        },
    },
});

function Search() {
    datatable.ajax.reload();
    datatable.draw();
};
