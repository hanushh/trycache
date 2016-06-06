/* `
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function (window, document, navigator, $, Papa, google) {


    var _this, app = {
        el: {
            submitCsvBtn: $('#submitCsv'),
            csvTA: $('#csvTA'),
            dataTable: $('#dataTable'),
            goBackBtn: $("#goBack"),
            textareaContainer: $("#textareaContainer"),
            dataTableContainer: $("#dataTableContainer")
        },
        markers: [],
        initialize: function () {
            _this = this;
            if (navigator.geolocation)
            {
                navigator.geolocation.getCurrentPosition(_this.initMap);
            } else {
                //this.initMap({coords:""})
            }

            _this.el.submitCsvBtn.click(_this.processCSV);
            _this.el.goBackBtn.click(_this.tableBackBtn);
        },
        initMap: function (position) {
            _this.map = new google.maps.Map(document.getElementById('mapContainer'), {
                center: {lat: position.coords.latitude, lng: position.coords.longitude},
                zoom: 8
            });

        },
        processCSV: function () {
            var data = Papa.parse(_this.el.csvTA.val(), {delimiter: ","});
            //console.log(data);

            _this.el.dataTable
                    .find("thead").html(_this.parseTableHeader(data['data']))
                    .end()
                    .find("tbody").html(_this.parseTableContent(data['data']));
            
            _this.addMarkers(data['data']);
            _this.el.textareaContainer.slideUp(function () {
                _this.el.dataTableContainer.slideDown('fast');
            });


        },
        parseTableHeader: function (data) {
            var tr = $("<tr/>");
            data[0].forEach(function (column) {
                var td = $("<td/>").text(column);
                tr.append(td);
            });
            return tr;

        },
        parseTableContent: function (data) {
            var content = document.createDocumentFragment();
            data.shift();
            data.forEach(function (row) {
                var tr = $("<tr/>");
                row.forEach(function (column) {
                    
                    var td = $("<td/>").html(_this.parseColumnContent(column));
                    td.appendTo(tr);
                });
                content.appendChild(tr[0]);

            });

            return content;

        },
        parseColumnContent: function (data) {
            if (data){
                
                return $("<img/>").attr("src", data);
            } else {
                return data;
            }
            
        },
        addMarkers: function (data) {
            _this.clearMarkers();
            data.forEach(function (row) {

                var marker = new google.maps.Marker({
                    position: {lat: row[9], lng: row[10]},
                    map: _this.map,
                    title: row[1]
                });
                _this.markers.push(marker);
            });
        },
        
        tableBackBtn: function () {

            _this.el.dataTableContainer.slideUp(function () {
                _this.el.textareaContainer.slideDown('fast');
            });


        },
        
        clearMarkers: function () {

            while (_this.markers.length) {
                (function () {
                    var marker = _this.markers.pop();
                    marker.setMap(null);
                })();
            }

        }

    };



    $(document).ready(app.initialize.bind(app));


})(window, document, navigator, jQuery, Papa, google);